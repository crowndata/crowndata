"use client";

import WebViewer from "@rerun-io/web-viewer-react";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <WebViewer
        width="800px"
        height="600px"
        rrd="https://app.rerun.io/version/0.19.0/examples/dna.rrd"
      />
    </Suspense>
  );
}
