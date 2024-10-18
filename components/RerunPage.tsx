import { Input } from "@nextui-org/react";
import WebViewer from "@rerun-io/web-viewer-react";
import { useEffect, useState } from "react";

const RerunPage = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [rrdFile, setRrdFile] = useState<string>(
    "https://app.rerun.io/version/0.19.0/examples/dna.rrd",
  );

  // Ensure that this code runs only on the client side
  useEffect(() => {
    setIsClient(true); // Indicates that the component is rendered on the client
  }, []);

  // Now safe to use `document` or `window` inside the client-side block
  useEffect(() => {
    if (isClient) {
      console.log("Document is accessible");
    }
  }, [isClient]);

  const handleRrdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRrdFile(e.target.value);
  };

  return (
    <>
      {isClient ? (
        <>
          <div>
            <Input
              label="RRD File URL"
              placeholder="Enter RRD file URL"
              value={rrdFile}
              onChange={handleRrdFileChange}
              width="300px"
            />
          </div>
          <WebViewer width="800px" height="600px" rrd={rrdFile} />
        </>
      ) : null}
    </>
  );
};

export default RerunPage;
