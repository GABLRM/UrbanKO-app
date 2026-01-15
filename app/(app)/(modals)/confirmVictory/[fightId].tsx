import { Colors } from '@/constants/Colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ConfirmVictoryData, confirmVictorySchema } from '@/schemas/confirmVictorySchema';
import { useAuth } from '@/contexts/AuthenticationContext';
import { ImageInfo } from '@/type/imageInfo';
import CameraModal from '@/components/CameraModal';
import { useUploadFightImage } from '@/hooks/useUploadFightImage';
import { useFinishFight } from '@/hooks/useFinishFight';

export default function FightId() {
    const { fightId }: { fightId: string } = useLocalSearchParams();
    const { user } = useAuth();

    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const finishFightMutation = useFinishFight();
    const uploadFightImageMutation = useUploadFightImage();
    const router = useRouter();

    const { handleSubmit } = useForm<ConfirmVictoryData>({
        resolver: zodResolver(confirmVictorySchema),
        defaultValues: {
            winner: user?._id,
            photo: '',
        },
        mode: 'onChange',
    });

    const patchFightWinner = (userId: string, imageUrl: string) => {
        const payload = {
            fightId,
            winnerId: userId,
            image: imageUrl,
        };

        finishFightMutation.mutate(payload, {
            onSuccess: () => {
                router.back();
            },
            onError: (error: Error) => {
                console.error(error);
            },
        });
    };

    const uploadImage = (userId: string, imageInfo: ImageInfo) => {
        const uploadImageData = { fightId, imageInfo };

        uploadFightImageMutation.mutate(uploadImageData, {
            onSuccess: (imageUrl) => {
                patchFightWinner(userId, imageUrl);
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
                router.back();
            },
        });
    };

    const onSave = (data: ConfirmVictoryData) => {
        if (!user || !imageInfo) {
            return;
        }

        uploadImage(user._id, imageInfo);
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={false} statusBarTranslucent={true}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={{ paddingVertical: 20 }}>
                        <Pressable onPress={() => router.back()}>
                            <FontAwesome6 name={'arrow-left'} size={20} color={Colors.white} />
                        </Pressable>
                    </View>
                    <View style={{ ...styles.modalHeader, marginBottom: 10 }}>
                        <Text style={styles.label}>Photo de Victoire</Text>
                        <Pressable style={styles.cameraButton} onPress={() => setIsVisible(true)}>
                            <Text style={{ ...styles.label, marginBottom: 0 }}>
                                Ouvrir la caméra
                            </Text>
                        </Pressable>
                        {!!imageInfo?.uri && (
                            <Image source={{ uri: imageInfo.uri }} width={300} height={520} />
                        )}
                        <View>
                            <Pressable
                                style={styles.confirmButton}
                                disabled={!imageInfo}
                                onPress={handleSubmit(onSave)}
                            >
                                <View>
                                    <Text style={{ color: Colors.white }}>Sauvegarder</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                    <CameraModal
                        isVisible={isVisible}
                        setIsVisible={setIsVisible}
                        setImageInfo={setImageInfo}
                    />
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: Colors.background,
    },
    modalContainer: {
        flex: 1,
        flexGrow: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        gap: 20,
    },
    closeText: {
        fontSize: 18,
        color: Colors.secondary,
    },
    confirmButton: {
        width: 200,
        backgroundColor: Colors.primary,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Colors.black,
        borderWidth: 2,
    },
    saveText: {
        fontSize: 18,
        color: Colors.primary,
    },
    cameraButton: {
        backgroundColor: Colors.inputBackground,
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: Colors.customGrey,
        borderWidth: 1,
    },
    label: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.customGrey,
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    button: {
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    buttonSelected: { backgroundColor: Colors.primary },
    buttonNotSelected: { backgroundColor: Colors.background },
    disciplinesInput: {
        gap: 5,
        backgroundColor: Colors.inputBackground,
        padding: 10,
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderColor: Colors.customGrey,
        borderWidth: 1,
        width: '100%',
    },
    error: {
        color: Colors.primary,
        marginTop: 5,
    },
});
