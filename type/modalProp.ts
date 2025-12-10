import { ImageInfo } from '@/type/imageInfo';

interface ModalPropInterface {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

export type ModalProp = ModalPropInterface;

export type CameraModalProp = ModalPropInterface & {
    setImageInfo: (imageInfo: ImageInfo) => void;
};
