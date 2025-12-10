import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthenticationContext';
import { Disciplines } from '@/enums/disciplines';
import { usePatchMe } from '@/hooks/usePatchMe';
import { ProfileEditionData, profileEditionSchema } from '@/schemas/profileEditionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUploadImage } from '@/hooks/useUploadImage';
import { ImageInfo } from '@/type/imageInfo';
import CameraModal from '@/components/CameraModal';

export default function ProfileEditionModal() {
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { user, refreshUser } = useAuth();
    const router = useRouter();

    const patchMeMutation = usePatchMe();
    const uploadImageMutation = useUploadImage();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileEditionData>({
        resolver: zodResolver(profileEditionSchema),
        defaultValues: {
            username: user?.username ?? undefined,
            age: user?.age ?? undefined,
            height: user?.height,
            disciplines: user?.disciplines ?? [],
            weight: user?.weight,
            gender: user?.gender ?? undefined,
        },
        mode: 'onChange',
    });

    const uploadImage = (data: ProfileEditionData, imageInfo: ImageInfo) => {
        const uploadImageData = { userId: user!._id, imageInfo };
        uploadImageMutation.mutate(uploadImageData, {
            onSuccess: (imageUrl) => {
                patchMe(data, imageUrl);
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
                setIsLoading(false);
                router.back();
            },
        });
    };

    const patchMe = (data: ProfileEditionData, imageUrl?: string) => {
        const payload = { ...data };

        if (imageUrl) {
            payload.image = imageUrl;
        }

        patchMeMutation.mutate(payload, {
            onSuccess: async () => {
                await refreshUser();
                setIsLoading(false);
                router.navigate(`/(app)/(tabs)/profile/${user!._id}`);
            },
            onError: (error) => {
                console.error('Failed to update user:', error);
                setIsLoading(false);
                router.back();
            },
        });
    };

    const onSave = (data: ProfileEditionData) => {
        if (Object.values(errors).length) {
            return;
        }

        setIsLoading(true);

        if (imageInfo) {
            uploadImage(data, imageInfo);

            return;
        }

        patchMe(data);
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Permission required',
                'Permission to access the media library is required.',
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.canceled) {
            return;
        }

        setImageInfo({
            uri: result.assets[0].uri,
            name: result.assets[0].fileName ?? '',
            mimetype: result.assets[0].mimeType ?? '',
        });
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={false} statusBarTranslucent={true}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.closeText}>Annuler</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSubmit(onSave)}>
                            <Text
                                style={{
                                    ...styles.saveText,
                                    opacity: !!Object.values(errors).length ? 0.5 : 1,
                                }}
                            >
                                Enregistrer
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Photo de profile</Text>
                        <View style={{ ...styles.modalHeader, marginBottom: 10 }}>
                            <Pressable
                                style={styles.cameraButton}
                                onPress={() => setIsVisible(true)}
                            >
                                <Text style={{ ...styles.label, marginBottom: 0 }}>Camera</Text>
                            </Pressable>
                            {!!imageInfo?.uri && (
                                <Image source={{ uri: imageInfo.uri }} width={100} height={100} />
                            )}
                            <Pressable style={styles.cameraButton} onPress={() => pickImage()}>
                                <Text style={{ ...styles.label, marginBottom: 0 }}>Galerie</Text>
                            </Pressable>
                        </View>
                        <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Pseudonyme"
                                    placeholder="Ex: LeDestructeur"
                                    textContentType="username"
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    value={value?.toLowerCase()}
                                    error={errors.username?.message}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="age"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Âge"
                                    placeholder="ex: 25"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={value !== undefined ? String(value) : ''}
                                    error={errors.age?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="height"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Taille en cm"
                                    placeholder="ex: 180"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={!!value ? String(value) : ''}
                                    error={errors.height?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="weight"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Poids en kg"
                                    placeholder="ex: 80"
                                    textContentType="none"
                                    autoCapitalize="none"
                                    onChangeText={(val) => {
                                        const numberValue = !val ? '' : Number(val);
                                        onChange(numberValue);
                                    }}
                                    onBlur={onBlur}
                                    value={!!value ? String(value) : ''}
                                    error={errors.weight?.message}
                                    isNumber={true}
                                    editable={!isLoading}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="disciplines"
                            render={({ field: { value, onChange } }) => (
                                <View>
                                    <Text style={styles.label}>Disciplines</Text>

                                    <View style={styles.disciplinesInput}>
                                        {Object.entries(Disciplines).map(([key, enumValue]) => {
                                            const isSelected = value.includes(enumValue);
                                            return (
                                                <TouchableOpacity
                                                    key={key}
                                                    style={[
                                                        styles.button,
                                                        isSelected
                                                            ? styles.buttonSelected
                                                            : styles.buttonNotSelected,
                                                    ]}
                                                    onPress={() => {
                                                        if (isSelected) {
                                                            onChange(
                                                                value.filter(
                                                                    (discipline) =>
                                                                        discipline !== enumValue,
                                                                ),
                                                            );

                                                            return;
                                                        }

                                                        onChange([...(value ?? []), enumValue]);
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: isSelected
                                                                ? Colors.white
                                                                : Colors.secondary,
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {enumValue}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            )}
                        />
                        {errors.disciplines && (
                            <Text style={styles.error}>{errors.disciplines.message}</Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
                <CameraModal
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                    setImageInfo={setImageInfo}
                />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    closeText: {
        fontSize: 18,
        color: Colors.secondary,
    },
    saveText: {
        fontSize: 18,
        color: Colors.primary,
    },
    cameraButton: {
        backgroundColor: Colors.inputBackground,
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: Colors.customGrey,
        borderWidth: 1,
    },
    form: {
        flex: 1,
        gap: 10,
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
