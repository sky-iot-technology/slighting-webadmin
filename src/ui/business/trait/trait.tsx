import { TraitKey } from '@/core/domains/catalogues';
import { Slider } from '@/ui/components/ui/slider';
import { Switch } from '@/ui/components/ui/switch';
import { JSX } from 'react';

type TraitUIConfig = {
  label: string;
  defaultValue: unknown;
  render: (props: TraitRenderProps) => JSX.Element;
};

type TraitRenderProps = {
  value: any;
  onChange: (v: any) => void;
  disabled?: boolean;
};

export const getTraitUiMap = (t: any): Record<TraitKey, TraitUIConfig> => ({
  'lms.devices.traits.OnOff': {
    label: t('calendar.on_off' as any),
    defaultValue: false,
    render: ({ value, onChange, disabled }) => (
      <div className='flex items-center gap-2'>
        <Switch
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          className='data-[state=checked]:bg-green-500'
        />
        <span
          className={`pt-0.5 text-[11px] font-medium ${
            value ? 'text-green-600' : 'text-gray-400'
          }`}
        >
          {value ? t('calendar.on' as any) : t('calendar.off' as any)}
        </span>
      </div>
    )
  },

  'lms.devices.traits.Brightness': {
    label: t('calendar.brightness' as any),
    defaultValue: 0,
    render: ({ value = 0, onChange, disabled }) => (
      <div className='flex items-center gap-2'>
        <Slider
          value={[value]}
          max={100}
          step={1}
          disabled={disabled}
          onValueChange={(v) => onChange(v[0])}
          className='[&_[data-slot=slider-thumb]]:border-primary [&_[data-slot=slider-track]]:bg-map-track-slider-active [&_[data-slot=slider-range]]:bg-map-range-slider-active w-[120px] cursor-pointer self-center [&_[data-slot=slider-range]]:!h-[4px] [&_[data-slot=slider-thumb]]:!h-3 [&_[data-slot=slider-thumb]]:!w-3 [&_[data-slot=slider-thumb]]:rounded-full [&_[data-slot=slider-thumb]]:border-[0.5px] [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-track]]:!h-[4px]'
        />
        <span className='ml-1'>{value}%</span>
      </div>
    )
  },

  'lms.devices.traits.Volume': {
    label: t('calendar.volume' as any),
    defaultValue: 50,
    render: ({ value = 50, onChange }) => (
      <Slider
        value={[value]}
        max={100}
        step={1}
        onValueCommit={(v) => onChange(v[0])}
      />
    )
  },

  'lms.devices.traits.Mute': {
    label: t('calendar.mute' as any),
    defaultValue: false,
    render: ({ value, onChange }) => (
      <Switch checked={!!value} onCheckedChange={onChange} />
    )
  }
});
