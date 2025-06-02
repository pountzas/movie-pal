import Svg, { Rect, Path } from "react-native-svg";
const ArrowUp = ({ size = 35, outerFill = "red", innerFill = "#fff" }) => (
  <Svg
    width={size}
    height={size}
    fill="none"
    style={{
      transform: [{ rotate: `-90deg` }]
    }}
  >
    <Rect
      width={size}
      height={size}
      fill={outerFill}
      fillOpacity={0.94}
      rx={17.5}
    />
    <Path
      fill={innerFill}
      d="M13 23.605a1 1 0 0 0 1.516.856l11.063-6.667a1 1 0 0 0 0-1.713L14.516 9.414A1 1 0 0 0 13 10.27v13.335Z"
    />
  </Svg>
);
export default ArrowUp;
