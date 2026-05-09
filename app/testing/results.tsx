import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { TestResult, QuestionResult } from '@/types/test-result.types';
import {
  formatDuration,
  getDifficultyLabel,
  getResultMessage,
} from '@/services/test-result-service';

// ════════════════════════════════════════════
//  Score Ring (animated SVG-like circle)
// ════════════════════════════════════════════

function ScoreRing({ score, passed }: { score: number; passed: boolean }) {
  const accentClass = passed ? 'text-emerald-500' : 'text-rose-500';
  const ringColor = passed ? 'border-emerald-500' : 'border-rose-500';
  const bgColor = passed ? 'bg-emerald-50' : 'bg-rose-50';

  return (
    <View className="items-center">
      <View
        className={`h-44 w-44 items-center justify-center rounded-full ${bgColor}`}
      >
        <View
          className={`h-40 w-40 items-center justify-center rounded-full border-[6px] ${ringColor} bg-background`}
        >
          <Text className={`text-6xl font-black tracking-tighter ${accentClass}`}>
            {score}
          </Text>
          <Text className="-mt-1 text-sm font-medium text-muted-foreground">
            percent
          </Text>
        </View>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════
//  Compact stats row
// ════════════════════════════════════════════

interface StatProps {
  value: string | number;
  label: string;
  tone?: 'default' | 'success' | 'danger' | 'muted';
}

function Stat({ value, label, tone = 'default' }: StatProps) {
  const toneClass = {
    default: 'text-foreground',
    success: 'text-emerald-600',
    danger: 'text-rose-600',
    muted: 'text-muted-foreground',
  }[tone];

  return (
    <View className="flex-1 items-center">
      <Text className={`text-2xl font-bold tracking-tight ${toneClass}`}>
        {value}
      </Text>
      <Text className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
    </View>
  );
}

function StatsRow({ result }: { result: TestResult }) {
  return (
    <View className="flex-row rounded-2xl border border-border bg-card px-4 py-5">
      <Stat
        value={result.correctAnswers}
        label="Correct"
        tone="success"
      />
      <View className="w-px self-stretch bg-border" />
      <Stat value={result.wrongAnswers} label="Mistakes" tone="danger" />
      <View className="w-px self-stretch bg-border" />
      <Stat
        value={formatDuration(result.totalTimeSpent)}
        label="Time"
        tone="muted"
      />
    </View>
  );
}

// ════════════════════════════════════════════
//  Progress bar - visual breakdown
// ════════════════════════════════════════════

function ProgressBreakdown({ result }: { result: TestResult }) {
  const { correctAnswers, wrongAnswers, skippedAnswers, totalQuestions } = result;
  const correctPct = (correctAnswers / totalQuestions) * 100;
  const wrongPct = (wrongAnswers / totalQuestions) * 100;
  const skippedPct = (skippedAnswers / totalQuestions) * 100;

  return (
    <View className="gap-3">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-sm font-semibold text-foreground">
          Answer breakdown
        </Text>
        <Text className="text-xs text-muted-foreground">
          {correctAnswers}/{totalQuestions}
        </Text>
      </View>

      {/* Bar */}
      <View className="h-2 flex-row overflow-hidden rounded-full bg-muted">
        {correctPct > 0 && (
          <View
            className="h-full bg-emerald-500"
            style={{ width: `${correctPct}%` }}
          />
        )}
        {wrongPct > 0 && (
          <View
            className="h-full bg-rose-500"
            style={{ width: `${wrongPct}%` }}
          />
        )}
        {skippedPct > 0 && (
          <View
            className="h-full bg-muted-foreground/40"
            style={{ width: `${skippedPct}%` }}
          />
        )}
      </View>

      {/* Legend */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        <LegendItem color="bg-emerald-500" label={`Correct · ${correctAnswers}`} />
        {wrongAnswers > 0 && (
          <LegendItem color="bg-rose-500" label={`Mistakes · ${wrongAnswers}`} />
        )}
        {skippedAnswers > 0 && (
          <LegendItem
            color="bg-muted-foreground/40"
            label={`Skipped · ${skippedAnswers}`}
          />
        )}
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`h-2 w-2 rounded-full ${color}`} />
      <Text className="text-xs text-muted-foreground">{label}</Text>
    </View>
  );
}

// ════════════════════════════════════════════
//  Question card - one question result
// ════════════════════════════════════════════

function QuestionCard({
  result,
  index,
}: {
  result: QuestionResult;
  index: number;
}) {
  const { question, selectedAnswer, isCorrect } = result;
  const correctAnswer = question.answers.find((a) => a.isCorrect);
  const wasSkipped = selectedAnswer === null;

  // Status
  const statusConfig = wasSkipped
    ? { label: 'Skipped', icon: '−', cls: 'bg-muted' }
    : isCorrect
      ? { label: 'Correct', icon: '✓', cls: 'bg-emerald-100' }
      : { label: 'Wrong', icon: '✗', cls: 'bg-rose-100' };

  const iconCls = wasSkipped
    ? 'text-muted-foreground'
    : isCorrect
      ? 'text-emerald-600'
      : 'text-rose-600';

  return (
    <View className="rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <View className="mb-4 flex-row items-start gap-3">
        <View
          className={`h-9 w-9 items-center justify-center rounded-full ${statusConfig.cls}`}
        >
          <Text className={`text-lg font-bold ${iconCls}`}>
            {statusConfig.icon}
          </Text>
        </View>
        <View className="flex-1 pt-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Question {index + 1}
            </Text>
            <View className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <Text className={`text-[11px] font-semibold uppercase tracking-wider ${iconCls}`}>
              {statusConfig.label}
            </Text>
          </View>
          <Text className="mt-1 text-base font-medium leading-snug text-foreground">
            {question.text}
          </Text>
        </View>
      </View>

      {/* Answer review */}
      <View className="gap-2">
        {!wasSkipped && (
          <AnswerLine
            label="Your answer"
            text={selectedAnswer.text}
            tone={isCorrect ? 'correct' : 'wrong'}
          />
        )}

        {(!isCorrect || wasSkipped) && correctAnswer && (
          <AnswerLine
            label="Correct answer"
            text={correctAnswer.text}
            tone="correct"
          />
        )}
      </View>

      {/* Explanation */}
      {question.explanation ? (
        <View className="mt-4 rounded-xl bg-muted/60 px-4 py-3">
          <Text className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Explanation
          </Text>
          <Text className="text-[13px] leading-relaxed text-foreground/80">
            {question.explanation}
          </Text>
        </View>
      ) : null}

      {/* Footer */}
      {result.timeSpent > 0 && (
        <View className="mt-3 flex-row items-center justify-end">
          <Text className="text-[11px] text-muted-foreground">
            ⏱ {formatDuration(result.timeSpent)}
          </Text>
        </View>
      )}
    </View>
  );
}

function AnswerLine({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: 'correct' | 'wrong';
}) {
  const isCorrect = tone === 'correct';
  return (
    <View
      className={`flex-row items-start gap-3 rounded-xl border px-3 py-2.5 ${
        isCorrect
          ? 'border-emerald-200 bg-emerald-50/50'
          : 'border-rose-200 bg-rose-50/50'
      }`}
    >
      <View
        className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
          isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      <View className="flex-1">
        <Text className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </Text>
        <Text
          className={`mt-0.5 text-sm font-medium ${
            isCorrect ? 'text-emerald-900' : 'text-rose-900'
          }`}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════
//  Filter pills (All / Correct / Wrong)
// ════════════════════════════════════════════

type FilterMode = 'all' | 'correct' | 'wrong';

function FilterPills({
  mode,
  onChange,
  counts,
}: {
  mode: FilterMode;
  onChange: (m: FilterMode) => void;
  counts: { all: number; correct: number; wrong: number };
}) {
  const items: { key: FilterMode; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'correct', label: 'Correct', count: counts.correct },
    { key: 'wrong', label: 'Mistakes', count: counts.wrong },
  ];

  return (
    <View className="flex-row gap-2">
      {items.map((it) => {
        const active = mode === it.key;
        return (
          <Pressable
            key={it.key}
            onPress={() => onChange(it.key)}
            className={`flex-row items-center gap-2 rounded-full border px-4 py-2 ${
              active
                ? 'border-foreground bg-foreground'
                : 'border-border bg-card'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                active ? 'text-background' : 'text-foreground'
              }`}
            >
              {it.label}
            </Text>
            <View
              className={`rounded-full px-1.5 ${
                active ? 'bg-background/20' : 'bg-muted'
              }`}
            >
              <Text
                className={`text-[11px] font-bold ${
                  active ? 'text-background' : 'text-muted-foreground'
                }`}
              >
                {it.count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// ════════════════════════════════════════════
//  Main Screen
// ════════════════════════════════════════════

interface Props {
  result: TestResult;
  onRetry?: () => void;
  onHome?: () => void;
}

export default function TestResultScreen({ result, onRetry, onHome }: Props) {
  const [filter, setFilter] = React.useState<FilterMode>('all');

  const message = useMemo(
    () => getResultMessage(result.score, result.passed),
    [result.score, result.passed]
  );

  const filteredResults = useMemo(() => {
    if (filter === 'correct') {
      return result.questionResults.filter((r) => r.isCorrect);
    }
    if (filter === 'wrong') {
      return result.questionResults.filter((r) => !r.isCorrect);
    }
    return result.questionResults;
  }, [filter, result.questionResults]);

  const counts = {
    all: result.totalQuestions,
    correct: result.correctAnswers,
    wrong: result.wrongAnswers + result.skippedAnswers,
  };

  const handleRetry = () => {
    if (onRetry) onRetry();
    else router.back();
  };

  const handleHome = () => {
    if (onHome) onHome();
    else router.replace('/');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-12"
      >
        {/* ─── Hero Section ─── */}
        <View className="px-6 pt-6">
          {/* Quiz meta */}
          <View className="mb-1 flex-row items-center gap-2">
            <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {result.quiz.category}
            </Text>
            <View className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {getDifficultyLabel(result.quiz.difficulty)}
            </Text>
          </View>

          <Text className="text-2xl font-bold leading-tight tracking-tight text-foreground">
            {result.quiz.title}
          </Text>
        </View>

        {/* ─── Score Ring ─── */}
        <View className="px-6 pb-2 pt-10">
          <ScoreRing score={result.score} passed={result.passed} />

          <View className="mt-6 items-center">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              {message.title}
            </Text>
            <Text className="mt-1 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
              {message.subtitle}
            </Text>
          </View>

          {/* Pass/Fail badge */}
          <View className="mt-5 items-center">
            <View
              className={`flex-row items-center gap-1.5 rounded-full px-3 py-1 ${
                result.passed ? 'bg-emerald-100' : 'bg-rose-100'
              }`}
            >
              <View
                className={`h-1.5 w-1.5 rounded-full ${
                  result.passed ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
              <Text
                className={`text-xs font-semibold ${
                  result.passed ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {result.passed
                  ? `Passed · pass mark ${result.passingScore}%`
                  : `Failed · need ${result.passingScore}%`}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Stats ─── */}
        <View className="px-6 pt-8">
          <StatsRow result={result} />
        </View>

        {/* ─── Breakdown ─── */}
        <View className="px-6 pt-6">
          <View className="rounded-2xl border border-border bg-card p-5">
            <ProgressBreakdown result={result} />
          </View>
        </View>

        {/* ─── Divider ─── */}
        <View className="my-8 px-6">
          <View className="h-px bg-border" />
        </View>

        {/* ─── Questions Section ─── */}
        <View className="gap-4 px-6">
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Answer review
            </Text>
            <Text className="mt-1 text-xl font-bold tracking-tight text-foreground">
              What went wrong?
            </Text>
          </View>

          <FilterPills mode={filter} onChange={setFilter} counts={counts} />

          <View className="mt-2 gap-3">
            {filteredResults.map((qr) => (
              <QuestionCard
                key={qr.question.id}
                result={qr}
                index={result.questionResults.indexOf(qr)}
              />
            ))}

            {filteredResults.length === 0 && (
              <View className="items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10">
                <Text className="text-base font-medium text-muted-foreground">
                  Nothing here
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground/70">
                  No questions in this category
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ─── Actions ─── */}
        <View className="gap-3 px-6 pt-10">
          <Pressable
            onPress={handleRetry}
            className="items-center rounded-2xl bg-foreground py-4 active:opacity-80"
          >
            <Text className="text-base font-semibold text-background">
              Try again
            </Text>
          </Pressable>

          <Pressable
            onPress={handleHome}
            className="items-center rounded-2xl border border-border bg-card py-4 active:opacity-70"
          >
            <Text className="text-base font-semibold text-foreground">
              Back to home
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
