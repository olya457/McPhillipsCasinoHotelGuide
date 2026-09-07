import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './navigation/RootNavigator';
import {AppStateProvider} from './store/AppStateContext';
import {colors} from './theme';

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <AppStateProvider>
        <View style={styles.root}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <RootNavigator />
        </View>
      </AppStateProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});

export default App;
