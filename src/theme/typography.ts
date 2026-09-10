export const fontFamily = {
  headingBold: 'Outfit-Bold',
  headingSemiBold: 'Outfit-SemiBold',
  headingMedium: 'Outfit-Medium',
  headingRegular: 'Outfit-Regular',
  bodyRegular: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
} as const;

export const typography = {
  h1: { fontFamily: fontFamily.headingBold, fontSize: 26, lineHeight: 39 },
  h2: { fontFamily: fontFamily.headingBold, fontSize: 26, lineHeight: 39 },
  buttonLarge: { fontFamily: fontFamily.headingSemiBold, fontSize: 17, lineHeight: 25.5 },
  buttonLargeBold: { fontFamily: fontFamily.headingBold, fontSize: 17, lineHeight: 25.5 },
  buttonMedium: { fontFamily: fontFamily.headingSemiBold, fontSize: 15, lineHeight: 22.5 },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.3, textTransform: 'uppercase' as const },
  sectionLabel: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  body: { fontFamily: fontFamily.bodyRegular, fontSize: 15, lineHeight: 22.5 },
  bodySmall: { fontFamily: fontFamily.bodyRegular, fontSize: 14, lineHeight: 20 },
  bodySmallBold: { fontFamily: fontFamily.bodyBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 12, lineHeight: 16 },
  captionMedium: { fontFamily: fontFamily.bodyMedium, fontSize: 12, lineHeight: 16 },
  fine: { fontFamily: fontFamily.bodyRegular, fontSize: 11, lineHeight: 17.875 },
  listTitle: { fontFamily: fontFamily.headingSemiBold, fontSize: 14, lineHeight: 20 },
  input: { fontFamily: fontFamily.headingRegular, fontSize: 17, letterSpacing: 0.68 },
} as const;
