package com.example.maplocation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.maplocation.dto.LocationRequest;
import com.example.maplocation.dto.LocationResponse;
import com.example.maplocation.entity.Location;
import com.example.maplocation.exception.ResourceNotFoundException;
import com.example.maplocation.mapper.LocationDtoMapper;
import com.example.maplocation.repository.LocationRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * {@link LocationServiceImpl} の単体テスト。
 * 永続化層はモック化し、業務ロジック（採番・例外変換）を検証する。
 */
@ExtendWith(MockitoExtension.class)
class LocationServiceImplTest {

    @Mock
    private LocationRepository repository;

    // DTO 変換は実物を使う（単純な写像のため）。
    private final LocationDtoMapper dtoMapper = new LocationDtoMapper();

    private LocationServiceImpl newService() {
        return new LocationServiceImpl(repository, dtoMapper);
    }

    @Test
    void create_generatesIdAndTimestamps() {
        LocationServiceImpl target = newService();
        LocationRequest request = new LocationRequest("東京駅", "説明", 35.681236, 139.767125);

        LocationResponse response = target.create(request);

        ArgumentCaptor<Location> captor = ArgumentCaptor.forClass(Location.class);
        verify(repository).insert(captor.capture());
        Location saved = captor.getValue();

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isEqualTo(saved.getCreatedAt());
        assertThat(response.title()).isEqualTo("東京駅");
        assertThat(response.latitude()).isEqualTo(35.681236);
    }

    @Test
    void findById_whenMissing_throwsNotFound() {
        LocationServiceImpl target = newService();
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> target.findById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void delete_whenNothingDeleted_throwsNotFound() {
        LocationServiceImpl target = newService();
        UUID id = UUID.randomUUID();
        when(repository.deleteById(id)).thenReturn(0);

        assertThatThrownBy(() -> target.delete(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void update_whenExists_updatesFields() {
        LocationServiceImpl target = newService();
        UUID id = UUID.randomUUID();
        Location existing = new Location();
        existing.setId(id);
        when(repository.findById(id)).thenReturn(Optional.of(existing));

        LocationRequest request = new LocationRequest("新タイトル", "新説明", 10.0, 20.0);
        LocationResponse response = target.update(id, request);

        verify(repository).update(any(Location.class));
        assertThat(response.title()).isEqualTo("新タイトル");
        assertThat(response.longitude()).isEqualTo(20.0);
    }

    @Test
    void findById_whenExists_returnsResponse() {
        LocationServiceImpl target = newService();
        UUID id = UUID.randomUUID();
        Location existing = new Location();
        existing.setId(id);
        existing.setTitle("皇居");
        when(repository.findById(eq(id))).thenReturn(Optional.of(existing));

        LocationResponse response = target.findById(id);

        assertThat(response.id()).isEqualTo(id);
        assertThat(response.title()).isEqualTo("皇居");
    }
}
