import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

interface SliderProps {
    label: string;
    initialValue: number;
    min: number;
    max: number;
    onChange: (newValue: number) => void;
}

function valuetext(value: number) {
  return `${value}`;
}

export default function ParameterSlider( props: SliderProps) {
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Typography variant="overline" gutterBottom sx={{ fontSize: '.8rem' }}>
        {props.label}
      </Typography>
      <Box sx={{ height: 20 }} />
      <Slider
        defaultValue={props.initialValue}
        getAriaValueText={valuetext}
        step={.05}
        min={props.min}
        max={props.max}
        onChange={(event, value, activeThumb)=>props.onChange(value)}
        valueLabelDisplay="on"
      />
    </Box>
  );
}