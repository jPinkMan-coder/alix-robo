import Toast from 'react-native-root-toast';

export default function showErrorToast(message: string) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    containerStyle: {
      marginTop: 50,
      alignSelf: 'flex-end', // pushes it to top right
      marginRight: 20,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#ef4444', // red error color
    },
    textStyle: {
      color: '#fff',
      fontWeight: '600',
    },
  });
}