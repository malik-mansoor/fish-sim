import { forwardRef } from "react";
import AbsorptionEffect from "./AbsorptionEffect";

export default forwardRef(function Absorption(props, ref) {
	const effect = new AbsorptionEffect(props);

	return <primitive ref={ref} object={effect} />;
});
