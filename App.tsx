import { useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import * as QuickActions from 'expo-quick-actions';

const ITEMS: QuickActions.Action[] = [
  { id: 'new', title: 'New item', params: { href: '/new' } },
];

// Calls setItems back to back once the app goes to the background. The process keeps running, but with
// "Don't keep activities" on (or under memory pressure) the Activity is destroyed in the meantime.
async function setItemsWhileBackgrounded() {
  const start = Date.now();
  // Keep calling for a few seconds, long enough to overlap the Activity being destroyed.
  for (let i = 1; Date.now() - start < 5000; i++) {
    try {
      await QuickActions.setItems(ITEMS);
    } catch (error) {
      console.log(`[repro] setItems call ${i} rejected: ${String(error)}`);
      return;
    }
  }
  console.log('[repro] every setItems call resolved for 5 seconds');
}

export default function App() {
  const [state, setState] = useState(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      setState(next);
      if (next === 'background') {
        console.log('[repro] background, calling setItems');
        setItemsWhileBackgrounded();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>AppState: {state}</Text>
      <Text>Press Home, then check `adb logcat -s ReactNativeJS`</Text>
    </View>
  );
}
