package com.facebook.f8;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.ReactInstanceHolder;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;

/**
 * Created by giautm on 1/2/17.
 */
class AppNativeHost extends ReactNativeHost implements ReactInstanceHolder {
    private final CallbackManager mCallbackManager;

    AppNativeHost(Application application, CallbackManager callbackManager) {
        super(application);
        mCallbackManager = callbackManager;
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new FBSDKPackage(mCallbackManager),
                new LinearGradientPackage(),
                new RNSharePackage(),
                new RNSendIntentPackage(),
                new CodePush("qwfkzzq7Y8cSrkiuU7aRCkIP7XYLEJ6b-AFoe", this.getApplication(), BuildConfig.DEBUG),
                new ReactNativePushNotificationPackage()
        );
    }
}

public class MainApplication extends Application implements ReactApplication {
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final AppNativeHost mReactNativeHost = new AppNativeHost(this, mCallbackManager);

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        CodePush.setReactInstanceHolder(mReactNativeHost);
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
    }
}
