import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { SearchBar } from './search-bar';
import { Device } from '@/core/domains/devices';

type SelectedRegion = { id: string; name: string } | null;

type MapFilterProps = {
  devices: Device[];
  selectedRegion: SelectedRegion;
  onRegionChange: (region: SelectedRegion) => void;
  onSelectDevice?: (device: Device | null) => void;
};

export default function MapFilter({
  devices,
  selectedRegion,
  onRegionChange,
  onSelectDevice
}: MapFilterProps) {
  return (
    <div className='absolute top-[15px] left-[9px]'>
      <div className='bg-map-filter flex rounded-lg px-1 py-1'>
        <TreeProvider
          onRegionChange={onRegionChange}
          selectedRegion={selectedRegion}
        />

        <SearchBar devices={devices} onSelectDevice={onSelectDevice} />
      </div>
    </div>
  );
}
