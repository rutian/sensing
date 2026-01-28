import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

interface SliderProps {
    label: string;
    valueTextLabel?: string;
    value: number;
    min: number;
    max: number;
    onChange: (newValue: number) => void;
} 



export default function ParameterSlider(props: SliderProps) {
  
  function valuetext(value: number) {
    return `${value}` + (props.valueTextLabel ? ` ${props.valueTextLabel}` : '');
  }

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="overline" gutterBottom sx={{ fontSize: '1rem' }}>
        {props.label}
      </Typography>
      <Box sx={{ height: 20 }} />
      <Slider
        value={props.value}
        valueLabelFormat={valuetext}
        step={.05}
        min={props.min}
        max={props.max}
        onChange={(event, value, activeThumb)=>props.onChange(value)}
        valueLabelDisplay="on"
      />
    </Box>
  );
}