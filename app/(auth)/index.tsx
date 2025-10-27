import Header from '@/components/Header';
import Input from '@/components/Input';
import { Colors } from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.innerContainer}>
                <Input label={'test'} placeholder={'test'} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        width: '100%',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
});
