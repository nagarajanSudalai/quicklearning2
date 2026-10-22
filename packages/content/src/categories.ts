// Picture categories for odd-one-out and sorting puzzles. Each category belongs to a
// family; odd-one-out level 1 mixes families, level 2+ stays within one family.

export type Category = { id: string; label: string; family: string; picture: string; items: [emoji: string, name: string][] };

export const CATEGORIES: Category[] = [
  { id: 'farm', label: 'Farm animals', family: 'animals', picture: '🚜', items: [['🐮', 'cow'], ['🐷', 'pig'], ['🐔', 'hen'], ['🐑', 'sheep'], ['🐐', 'goat'], ['🐴', 'horse']] },
  { id: 'wild', label: 'Wild animals', family: 'animals', picture: '🌴', items: [['🦁', 'lion'], ['🐯', 'tiger'], ['🐘', 'elephant'], ['🐒', 'monkey'], ['🦓', 'zebra'], ['🦒', 'giraffe']] },
  { id: 'sea', label: 'Sea animals', family: 'animals', picture: '🌊', items: [['🐟', 'fish'], ['🐙', 'octopus'], ['🐬', 'dolphin'], ['🦀', 'crab'], ['🐳', 'whale'], ['🦈', 'shark']] },
  { id: 'fruit', label: 'Fruit', family: 'food', picture: '🧺', items: [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['🍓', 'strawberry'], ['🍐', 'pear'], ['🍊', 'orange'], ['🍉', 'watermelon'], ['🍒', 'cherries']] },
  { id: 'vegetables', label: 'Vegetables', family: 'food', picture: '🥬', items: [['🥕', 'carrot'], ['🥦', 'broccoli'], ['🌽', 'corn'], ['🥔', 'potato'], ['🥒', 'cucumber'], ['🍆', 'brinjal']] },
  { id: 'vehicles', label: 'Vehicles', family: 'things', picture: '🛣️', items: [['🚗', 'car'], ['🚌', 'bus'], ['🚲', 'bicycle'], ['✈️', 'aeroplane'], ['⛵', 'boat'], ['🚂', 'train'], ['🚜', 'tractor']] },
  { id: 'clothes', label: 'Clothes', family: 'things', picture: '👚', items: [['🧦', 'socks'], ['🧥', 'coat'], ['🎩', 'hat'], ['👕', 'shirt'], ['👟', 'shoe'], ['👗', 'dress'], ['🧤', 'gloves'], ['🧣', 'scarf']] },
  { id: 'school', label: 'School things', family: 'things', picture: '🏫', items: [['✏️', 'pencil'], ['📏', 'ruler'], ['📚', 'books'], ['🎒', 'school bag'], ['✂️', 'scissors'], ['🖍️', 'crayon']] },
  { id: 'weather', label: 'Weather', family: 'nature', picture: '🌤️', items: [['☀️', 'sun'], ['🌧️', 'rain'], ['❄️', 'snow'], ['⛅', 'cloud'], ['🌈', 'rainbow'], ['⚡', 'lightning']] },
];

/** Families count as categories too ("animals" contains farm, wild and sea animals). */
export function groupsContaining(emoji: string): string[] {
  const cats = CATEGORIES.filter((c) => c.items.some(([e]) => e === emoji));
  return [...cats.map((c) => c.id), ...new Set(cats.map((c) => c.family))];
}

const members = (group: string) =>
  new Set(CATEGORIES.filter((c) => c.id === group || c.family === group).flatMap((c) => c.items.map(([e]) => e)));

/**
 * The items that could fairly be called "the odd one out": x is valid if the other
 * items all share some group that x is not in. A good puzzle has exactly one.
 */
export function oddCandidates(options: string[]): string[] {
  const groups = [...new Set(CATEGORIES.flatMap((c) => [c.id, c.family]))];
  return options.filter((x) => {
    const rest = options.filter((o) => o !== x);
    return groups.some((g) => {
      const m = members(g);
      return rest.every((o) => m.has(o)) && !m.has(x);
    });
  });
}

export const nameOf = (emoji: string) => CATEGORIES.flatMap((c) => c.items).find(([e]) => e === emoji)?.[1] ?? emoji;
