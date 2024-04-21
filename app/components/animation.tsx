import cn from "classnames";
import Spline from "@splinetool/react-spline";

interface Props {
  className?: string;
}
export default function Animation({ className }: Props) {
  return (
    <div className="bg-black">
      <div
        className={cn("min-h-screen", className)}
        style={{ height: "100vh" }}
      >
        <Spline scene="https://prod.spline.design/QW2ng12QJhBmulEn/scene.splinecode" />
      </div>
    </div>
  );
}
