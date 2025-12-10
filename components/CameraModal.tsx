import { View, StyleSheet, Button, Text, Modal, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { CameraModalProp } from '@/type/modalProp';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { randomUUID } from 'expo-crypto';

export default function CameraModal(cameraModalProp: CameraModalProp) {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<'front' | 'back'>('front');

    const cameraRef = useRef<CameraView | null>(null);

    const toggleFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View>
                <Text>La permission caméra est requise</Text>
                <Button title="Autoriser" onPress={requestPermission} />
            </View>
        );
    }

    const takePhoto = () => {
        if (!cameraRef.current) {
            return;
        }

        cameraRef.current.takePictureAsync().then((photo) => {
            cameraModalProp.setImageInfo({
                uri: photo.uri,
                name: randomUUID(),
                mimetype: `image/${photo.format}`,
            });
            cameraModalProp.setIsVisible(false);
        });
    };

    return (
        <Modal
            animationType="slide"
            visible={cameraModalProp.isVisible}
            onRequestClose={() => {
                cameraModalProp.setIsVisible(!cameraModalProp.isVisible);
            }}
        >
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    ref={cameraRef}
                    mode="picture"
                    facing={facing}
                    mute={false}
                    responsiveOrientationWhenOrientationLocked
                />
                <View style={styles.shutterContainer}>
                    <View />
                    <Pressable onPress={takePhoto}>
                        {({ pressed }) => (
                            <View
                                style={[
                                    styles.shutterBtn,
                                    {
                                        opacity: pressed ? 0.5 : 1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.shutterBtnInner,
                                        {
                                            backgroundColor: 'white',
                                        },
                                    ]}
                                />
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleFacing}>
                        <FontAwesome6 name="rotate-left" size={32} color="white" />
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraContainer: StyleSheet.absoluteFillObject,
    camera: StyleSheet.absoluteFillObject,
    shutterContainer: {
        position: 'absolute',
        bottom: 44,
        left: 0,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    shutterBtn: {
        backgroundColor: 'transparent',
        borderWidth: 5,
        borderColor: 'white',
        width: 85,
        height: 85,
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    shutterBtnInner: {
        width: 70,
        height: 70,
        borderRadius: 50,
    },
});
