/**
 * Maps each `categoryTabs` id (HomeScreen's "shop by store" chip row) to the real
 * backend category slug it should open. Tabs mapped to `null` are cross-cutting
 * curated collections (a personalized feed, or a discount/value filter) rather than
 * a distinct product vertical, so they stay as a home-screen highlight only — the
 * "Top Deals"/"Grab it before it's gone" sections on the same screen already surface
 * their real backend-fetched products.
 */
export const CATEGORY_TAB_TARGETS: Record<string, string | null> = {
  foryou: null,
  fresh: 'grocery',
  grocery: 'grocery',
  electronics: 'electronics',
  beauty: 'personal-care',
  monsoon: 'monsoon',
  home: 'household',
  mobiles: 'mobiles',
  fashion: 'fashion',
  dealzone: null,
  kids: 'kids',
  xtrasaver: null,
  healthcare: 'healthcare',
  gifting: 'gifting',
  paanstore: 'paanstore',
};
