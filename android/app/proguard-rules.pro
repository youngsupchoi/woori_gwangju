# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# FusedLocationProviderClient를 최적화에서 제외
-keep class com.google.android.gms.location.FusedLocationProviderClient { *; }
-keep class com.google.android.gms.location.LocationCallback { *; }
-keep class com.google.android.gms.location.LocationRequest { *; }

-keepattributes *Annotation*
-keep class com.facebook.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.** { *; }