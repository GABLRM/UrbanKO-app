import { StyleSheet, Pressable, View, Modal, Text, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type EasterEggProp = {
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
};

export default function EasterEggModal(easterEggProp: EasterEggProp) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={easterEggProp.isVisible}
            onRequestClose={() => {
                easterEggProp.setIsVisible(!easterEggProp.isVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.xButton}>
                        <Pressable
                            style={{ padding: 10 }}
                            onPress={() => easterEggProp.setIsVisible(false)}
                        >
                            <FontAwesome6 name="x" size={20} color={Colors.customGrey} />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>POV: 5 ans d&apos;étude à Ynov</Text>
                        <Image
                            source={{
                                uri: 'https://media1.tenor.com/m/58s_sP-gCPMAAAAC/ynov-m%27a-tout-pris.gif',
                            }}
                            style={styles.gif}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: Colors.background,
        borderRadius: 20,
        height: 350,
        width: 380,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    xButton: { alignItems: 'flex-end', width: '100%' },
    modalContent: { justifyContent: 'flex-end', alignItems: 'center' },
    textStyle: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    modalText: {
        alignItems: 'flex-end',
        marginBottom: 15,
        textAlign: 'center',
        color: Colors.primary,
    },
    gif: { width: 350, height: 250, alignItems: 'center' },
});
