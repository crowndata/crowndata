import "@/styles/globals.css";

import { Select, SelectItem, SelectSection } from "@nextui-org/select";
import React from "react";

import { useURDFFiles } from "@/hooks/useURDFFile";
import {
  armURDFFiles,
  assemblyURDFFiles,
  gripperURDFFiles,
} from "@/utils/geometry";

import RobotControl from "./RobotControl";

const ThreeDScene: React.FC = () => {

  const { selectedKey, selectedFile, handleSelectChange } = useURDFFiles();

  return (
    <>
      <div className="flex w-full justify-start">
        <Select
          label="Embodiment"
          labelPlacement="inside"
          variant="underlined"
          placeholder="Select a model"
          selectedKeys={selectedKey ? [selectedKey] : []}
          onChange={handleSelectChange}
          className="max-w-xs w-full primary bg-gray-900"
          scrollShadowProps={{ isEnabled: false }}
        >
          <SelectSection showDivider title="assembly">
            {Object.keys(assemblyURDFFiles).map((key) => (
              <SelectItem key={key} className="w-full primary bg-gray-900">
                {key}
              </SelectItem>
            ))}
          </SelectSection>
          <SelectSection showDivider title="arm only">
            {Object.keys(armURDFFiles).map((key) => (
              <SelectItem key={key} className="w-full primary bg-gray-900">
                {key}
              </SelectItem>
            ))}
          </SelectSection>
          <SelectSection showDivider title="gripper only">
            {Object.keys(gripperURDFFiles).map((key) => (
              <SelectItem key={key} className="w-full primary bg-gray-900">
                {key}
              </SelectItem>
            ))}
          </SelectSection>
        </Select>
      </div>
      {/* Joint sliders and input fields */}
      <div className="flex w-full">
        {selectedFile && <RobotControl geometry={selectedFile} />}
      </div>
    </>
  );
};

export default ThreeDScene;
