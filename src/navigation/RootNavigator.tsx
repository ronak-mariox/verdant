import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  AddressFormScreen,
  AddressScreen,
  CancelIneligibleScreen,
  CancelOrderScreen,
  CartScreen,
  CategoryDetailScreen,
  CategoryScreen,
  CreateAccountScreen,
  DeliveryOptionsScreen,
  EditProfileScreen,
  HomeScreen,
  IssueDetailsScreen,
  IssueResolutionScreen,
  IssueResolvedScreen,
  IssueSubmittedScreen,
  LocationNotFoundScreen,
  LocationPermissionScreen,
  LocationSelectionScreen,
  LoginScreen,
  SignupScreen,
  NotificationDetailScreen,
  NotificationsScreen,
  OrderCancelledScreen,
  OrderConfirmationScreen,
  OrderDetailsScreen,
  OrderHistoryScreen,
  OrderIssueScreen,
  OrderTrackingScreen,
  OtpScreen,
  PaymentFailedScreen,
  PaymentScreen,
  PaymentSuccessScreen,
  ProcessingScreen,
  ProductDetailScreen,
  ProfileAddressesScreen,
  ProfilePaymentsScreen,
  ProfileScreen,
  RefundCompletedScreen,
  RefundDelayedScreen,
  RefundStatusScreen,
  ReorderScreen,
  ReportIssueScreen,
  ReviewOrderScreen,
  SearchScreen,
  SettingsScreen,
  SplashScreen,
  StoreDetailScreen,
  SupportHomeScreen,
} from '../screens';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
        <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
        <Stack.Screen name="LocationNotFound" component={LocationNotFoundScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Address" component={AddressScreen} />
        <Stack.Screen name="AddressForm" component={AddressFormScreen} />
        <Stack.Screen name="DeliveryOptions" component={DeliveryOptionsScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="OrderIssue" component={OrderIssueScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="Reorder" component={ReorderScreen} />
        <Stack.Screen name="CancelOrder" component={CancelOrderScreen} />
        <Stack.Screen name="CancelIneligible" component={CancelIneligibleScreen} />
        <Stack.Screen name="OrderCancelled" component={OrderCancelledScreen} />
        <Stack.Screen name="RefundStatus" component={RefundStatusScreen} />
        <Stack.Screen name="RefundDelayed" component={RefundDelayedScreen} />
        <Stack.Screen name="RefundCompleted" component={RefundCompletedScreen} />
        <Stack.Screen name="SupportHome" component={SupportHomeScreen} />
        <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
        <Stack.Screen name="IssueDetails" component={IssueDetailsScreen} />
        <Stack.Screen name="IssueSubmitted" component={IssueSubmittedScreen} />
        <Stack.Screen name="IssueResolution" component={IssueResolutionScreen} />
        <Stack.Screen name="IssueResolved" component={IssueResolvedScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileAddresses" component={ProfileAddressesScreen} />
        <Stack.Screen name="ProfilePayments" component={ProfilePaymentsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
