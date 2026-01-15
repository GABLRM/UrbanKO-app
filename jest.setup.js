// Testing library matchers are now built-in to React Native Testing Library v12.4+

// Mock Expo Winter (new module system)
global.__ExpoImportMetaRegistry = {
    register: jest.fn(),
};

// Mock structuredClone for Expo Winter
global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    deleteItem: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        canGoBack: jest.fn(() => true),
    })),
    useLocalSearchParams: jest.fn(() => ({})),
    useSegments: jest.fn(() => []),
    usePathname: jest.fn(() => '/'),
    Stack: {
        Screen: 'Screen',
    },
    Tabs: {
        Screen: 'Screen',
    },
    Link: 'Link',
    Redirect: 'Redirect',
}));

// Mock expo modules
jest.mock('expo-constants', () => ({
    expoConfig: {
        extra: {
            apiUrl: 'http://localhost:3000',
        },
    },
}));

jest.mock('expo-camera', () => ({
    CameraView: 'CameraView',
    useCameraPermissions: jest.fn(() => [{ granted: true }, jest.fn()]),
}));

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    MediaTypeOptions: {
        Images: 'Images',
    },
}));

jest.mock('expo-haptics', () => ({
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: {
        Light: 'Light',
        Medium: 'Medium',
        Heavy: 'Heavy',
    },
}));

// Mock React Native reanimated
jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
});

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
    const View = require('react-native').View;
    const mockGesture = {
        Pan: jest.fn(() => ({
            onUpdate: jest.fn().mockReturnThis(),
            onEnd: jest.fn().mockReturnThis(),
            onStart: jest.fn().mockReturnThis(),
            onFinalize: jest.fn().mockReturnThis(),
        })),
        Tap: jest.fn(() => ({
            numberOfTaps: jest.fn().mockReturnThis(),
            runOnJS: jest.fn().mockReturnThis(),
            onBegin: jest.fn().mockReturnThis(),
            onEnd: jest.fn().mockReturnThis(),
            onStart: jest.fn().mockReturnThis(),
            onFinalize: jest.fn().mockReturnThis(),
        })),
    };

    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        ToolbarAndroid: View,
        ViewPagerAndroid: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        NativeViewGestureHandler: View,
        TapGestureHandler: View,
        FlingGestureHandler: View,
        ForceTouchGestureHandler: View,
        LongPressGestureHandler: View,
        PanGestureHandler: View,
        PinchGestureHandler: View,
        RotationGestureHandler: View,
        RawButton: View,
        BaseButton: View,
        RectButton: View,
        BorderlessButton: View,
        FlatList: View,
        gestureHandlerRootHOC: jest.fn(),
        Directions: {},
        Gesture: mockGesture,
        GestureDetector: View,
        GestureHandlerRootView: View,
    };
});

// Mock React Native Progress
jest.mock('react-native-progress', () => ({
    Bar: 'Bar',
    Circle: 'Circle',
    Pie: 'Pie',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
    const React = require('react');
    return new Proxy(
        {},
        {
            get: (target, prop) => {
                // Return a mock React component for any icon
                return React.forwardRef((props, ref) =>
                    React.createElement('View', { ...props, ref }, prop),
                );
            },
        },
    );
});

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock(
    'react-native/Libraries/Animated/NativeAnimatedHelper',
    () => ({
        default: {},
    }),
    { virtual: true },
);

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
};

// Set environment variables
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:3000';
