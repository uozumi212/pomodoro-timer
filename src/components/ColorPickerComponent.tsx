import React, { useEffect, useRef } from "react";
import { VStack, Button } from "@chakra-ui/react";
import { SketchPicker, ColorResult } from "react-color";

interface ColorPickerComponentProps {
  colorPick: string;
  setColorPick: (color: string) => void;
  pickerVisible: boolean;
  setPickerVisible: (visible: boolean) => void;
}

const ColorPickerComponent: React.FC<ColorPickerComponentProps> = ({
  colorPick,
  setColorPick,
  pickerVisible,
  setPickerVisible,
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  // カラーピッカー起動とカラー設定
  const handleChangeComplete = (color: ColorResult) => {
    setColorPick(color.hex);
  };

  // カラーピッカーを閉じる
  const handlePickerClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setPickerVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  return (
    <VStack spacing={6}>
      {pickerVisible && (
        <div
          ref={pickerRef}
          style={{
            position: "absolute",
            zIndex: 2,
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          <SketchPicker
            color={colorPick}
            onChangeComplete={handleChangeComplete}
          />
          <Button
            mt={3}
            onClick={handlePickerClose}
            w="100%"
            _hover={{ bgColor: "red.300" }}
          >
            閉じる
          </Button>
        </div>
      )}
    </VStack>
  );
};

export default ColorPickerComponent;
