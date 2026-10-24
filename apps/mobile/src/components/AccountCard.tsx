import { GRADES, type Grade } from '@quickstep/content';
import { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useProgress } from '../lib/progress';
import { colors, font, text } from '../lib/theme';
import { Button3D } from './ui';

const confirm = (title: string, body: string, ok: string, run: () => void) => {
  if (Platform.OS === 'web') { if (window.confirm(`${title}\n\n${body}`)) run(); return; }
  Alert.alert(title, body, [{ text: 'Cancel', style: 'cancel' }, { text: ok, style: 'destructive', onPress: run }]);
};

/** Parent account: sign in with an email code, manage up to 4 children, sync progress. */
export function AccountCard() {
  const { account: a } = useProgress();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [adding, setAdding] = useState(false);

  if (!a.enabled) return null;
  const run = async (f: () => Promise<string | null | void>) => {
    setBusy(true); setError(null);
    const e = await f();
    setBusy(false);
    if (e) setError(e);
    return !e;
  };

  if (!a.email) {
    return (
      <View style={styles.card}>
        <Text style={text.h3}>Parent account</Text>
        <Text style={text.small}>Sign in to keep each child’s stars and progress safe and the same on every device. No password: we email you a 6-digit code.</Text>
        {!sent ? (
          <>
            <TextInput value={email} onChangeText={setEmail} placeholder="Your email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" style={styles.input} accessibilityLabel="Email" />
            <Button3D label={busy ? 'Sending…' : 'Email me a code'} disabled={busy || !/^\S+@\S+\.\S+$/.test(email.trim())} onPress={() => run(() => a.sendCode(email)).then((ok) => ok && setSent(true))} />
          </>
        ) : (
          <>
            <Text style={text.body}>We sent a code to {email.trim()}.</Text>
            <TextInput value={code} onChangeText={(t) => setCode(t.replace(/\D/g, ''))} placeholder="6-digit code" keyboardType="number-pad" maxLength={6} style={[styles.input, { letterSpacing: 6, textAlign: 'center' }]} accessibilityLabel="Code" />
            <Button3D label={busy ? 'Checking…' : 'Sign in'} disabled={busy || code.length !== 6} onPress={() => run(() => a.verifyCode(email, code))} />
            <Pressable onPress={() => { setSent(false); setCode(''); }} accessibilityRole="button"><Text style={styles.link}>Use a different email</Text></Pressable>
          </>
        )}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={text.h3}>Parent account</Text>
      <Text style={text.small}>Signed in as {a.email}{a.syncing ? ' · syncing…' : ''}</Text>
      <Text style={styles.label}>Who’s playing?</Text>
      {a.children.map((c) => {
        const on = a.active?.id === c.id;
        return (
          <Pressable key={c.id} onPress={() => a.selectChild(c)} accessibilityRole="button" accessibilityLabel={`Play as ${c.name}`} accessibilityState={{ selected: on }} style={[styles.child, on && styles.childOn]}>
            <Text style={styles.childName}>{on ? '● ' : '○ '}{c.name}</Text>
            <Text style={styles.value}>Grade {c.grade}</Text>
          </Pressable>
        );
      })}
      {a.children.length === 0 && <Text style={text.small}>Add your child to start syncing. What they have played on this device so far is kept.</Text>}
      {adding || a.children.length === 0 ? (
        <View style={{ gap: 8 }}>
          <TextInput value={name} onChangeText={setName} placeholder="Child’s first name or nickname" maxLength={20} style={styles.input} accessibilityLabel="Child's name" />
          <View style={styles.grades}>
            {GRADES.map((g) => (
              <Pressable key={g} onPress={() => setGrade(g)} accessibilityRole="button" accessibilityLabel={`Grade ${g}`} accessibilityState={{ selected: grade === g }} style={[styles.gradeChip, grade === g && styles.gradeOn]}>
                <Text style={[styles.gradeText, grade === g && { color: '#fff' }]}>{g}</Text>
              </Pressable>
            ))}
          </View>
          <Button3D label={busy ? 'Adding…' : 'Add child'} disabled={busy || !name.trim()} onPress={() => run(() => a.addChild(name, grade)).then((ok) => { if (ok) { setName(''); setAdding(false); } })} />
        </View>
      ) : a.children.length < 4 ? (
        <Pressable onPress={() => setAdding(true)} accessibilityRole="button"><Text style={styles.link}>+ Add a child</Text></Pressable>
      ) : null}
      {a.active && (
        <Pressable onPress={() => a.selectChild(null)} accessibilityRole="button"><Text style={styles.link}>Play without a profile on this device</Text></Pressable>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.row}>
        <Pressable onPress={() => run(a.signOut)} accessibilityRole="button"><Text style={styles.link}>Sign out</Text></Pressable>
        <Pressable
          onPress={() => confirm('Delete account?', 'This permanently deletes your account, your children’s profiles and all their synced progress.', 'Delete', () => run(a.deleteAccount))}
          accessibilityRole="button"
        >
          <Text style={[styles.link, { color: colors.wrongText }]}>Delete account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, gap: 10, borderWidth: 1, borderColor: colors.border },
  input: { fontFamily: font.bodyBold, fontSize: 17, borderWidth: 2, borderColor: colors.choiceBorder, borderRadius: 14, padding: 12, backgroundColor: colors.surface, color: colors.ink },
  link: { fontFamily: font.bodyBold, fontSize: 15, color: colors.brand, paddingVertical: 4 },
  error: { fontFamily: font.bodyBold, fontSize: 14, color: colors.wrongText },
  label: { fontFamily: font.bodyBold, fontSize: 16, color: colors.ink },
  value: { fontFamily: font.bodyHeavy, fontSize: 15, color: colors.muted },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  child: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 14, borderWidth: 2, borderColor: colors.choiceBorder },
  childOn: { borderColor: colors.brand, backgroundColor: colors.brandTint },
  childName: { fontFamily: font.bodyHeavy, fontSize: 16, color: colors.ink },
  grades: { flexDirection: 'row', gap: 8 },
  gradeChip: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: colors.choiceBorder, alignItems: 'center' },
  gradeOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  gradeText: { fontFamily: font.display, fontSize: 18, color: colors.ink },
});
