"use client";

import BarcodeReact from "react-barcode";

interface BarCodeProps {
	code: string;
}
export default function BarCode({ code }: BarCodeProps) {
	return <BarcodeReact value={code} format="EAN13" width={2} height={50} fontSize={15} />;
}
