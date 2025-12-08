import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Chip from '@/components/Chip';
import { Colors } from '@/constants/Colors';

type userSubInformationProps = {
    gender: string;
    age: number;
    height: number;
    weight: number;
    disciplines: string[];
};

export default function UserSubInformation({
    gender,
    age,
    weight,
    height,
    disciplines,
}: userSubInformationProps) {
    return (
        <View style={styles.subInfo}>
            <View style={styles.subInfoContainer}>
                <View style={styles.subInfoListContainer}>
                    <View style={styles.subInfoTitleContainer}>
                        <FontAwesome6 name="bullseye" size={30} color={Colors.primary} />
                        <Text style={styles.subInfoTitle}>Informations</Text>
                    </View>
                    <View style={styles.subInfoCategoryContainer}>
                        <Text style={styles.subInfoCategoryTitle}>Sexe</Text>
                        <Text style={styles.subInfoCategory}>{gender}</Text>
                    </View>
                    <View style={styles.subInfoCategoryContainer}>
                        <Text style={styles.subInfoCategoryTitle}>Âge</Text>
                        <Text style={styles.subInfoCategory}>{age} ans</Text>
                    </View>
                    <View style={styles.subInfoCategoryContainer}>
                        <Text style={styles.subInfoCategoryTitle}>Taille</Text>
                        <Text style={styles.subInfoCategory}>📏 {height} cm</Text>
                    </View>
                    <View style={styles.subInfoCategoryContainer}>
                        <Text style={styles.subInfoCategoryTitle}>Poids</Text>
                        <Text style={styles.subInfoCategory}>💪 {weight} kg</Text>
                    </View>
                    <View
                        style={{
                            ...styles.subInfoCategoryContainer,
                            paddingBottom: 10,
                        }}
                    >
                        <Text style={styles.subInfoCategoryTitle}>Discipline</Text>
                        <View style={styles.subInfoChipList}>
                            {disciplines.map((discipline) => (
                                <Chip text={discipline} key={discipline} />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subInfo: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 20,
    },
    subInfoContainer: {
        borderStyle: 'solid',
        borderColor: Colors.customGrey,
        width: '100%',
        borderWidth: 1,
        borderRadius: 20,
    },
    subInfoListContainer: {
        paddingTop: 20,
        paddingLeft: 10,
        display: 'flex',
        flexDirection: 'column',
    },
    subInfoTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    subInfoTitle: {
        paddingLeft: 10,
        color: Colors.primary,
        fontSize: 20,
    },
    subInfoCategoryContainer: {
        paddingTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subInfoCategoryTitle: {
        color: Colors.customGrey,
        fontSize: 18,
    },
    subInfoCategory: {
        paddingRight: 20,
        color: Colors.white,
        fontSize: 18,
    },
    subInfoChipList: {
        paddingRight: 14,
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        flexWrap: 'wrap',
        maxWidth: '65%',
        justifyContent: 'flex-end',
    },
});
