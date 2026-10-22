import { TOPICS } from '@quickstep/content';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Button3D, Screen } from '../components/ui';
import { say } from '../lib/feedback';
import { usePop } from '../lib/motion';
import { useProgress } from '../lib/progress';
import { colors, text } from '../lib/theme';

export default function Result() {
  const params = useLocalSearchParams<{ topic: string; stars: string; total: string }>();
  const topic = TOPICS.find((t) => t.id === params.topic);
  const stars = Number(params.stars) || 0;
  const total = Number(params.total) || 0;
  const { sound } = useProgress();
  const pop = usePop('result');
  const cheer = stars === total ? 'Perfect!' : stars >= total / 2 ? 'Well done!' : 'Good try!';

  useEffect(() => say(`${cheer} You earned ${stars} stars.`, sound), [cheer, stars, sound]);

  return (
    <Screen title={topic?.title}>
      <View style={styles.card}>
        <Animated.Text style={[styles.big, pop]}>🌟</Animated.Text>
        <Text style={[text.h1, { textAlign: 'center' }]}>{cheer}</Text>
        <Text style={[text.body, { textAlign: 'center' }]}>
          You got {stars} of {total} right on the first try.
        </Text>
        <Text style={styles.earned}>+{stars} ★</Text>
      </View>
      <Button3D label="Play again" size="lg" onPress={() => topic && router.replace(`/play/${topic.id}`)} />
      <Button3D
        label="Back to topics"
        color={colors.ink}
        shadow="#000"
        onPress={() => (topic ? router.replace(`/grade/${topic.grade}/${topic.subject}`) : router.replace('/'))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 28, padding: 28, gap: 12, alignItems: 'center', borderWidth: 3, borderColor: colors.ink },
  big: { fontSize: 72 },
  earned: { fontSize: 28, color: colors.starText, fontWeight: '800' },
});
