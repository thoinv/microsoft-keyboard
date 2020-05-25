package microsoft.keyboard;

import android.text.TextUtils;
import android.util.Log;

import com.google.gson.Gson;
import java.util.List;

public class LogUtils {
    private static final String TAG = "SE-KEYBOARD";
    private static boolean isLogEnable = true;

    public static void disableLog() {
        isLogEnable = false;
    }

    public static void logI(String message) {
        if (!isLogEnable) {
            return;
        }
        Log.i(TAG, composeDefaultMessage(message));
    }

    public static void showCurrentMethodName() {
        if (!isLogEnable) {
            return;
        }
        Log.i(TAG, composeDefaultMessage(""));
    }

    public static void logI(List<Integer> message) {
        if (!isLogEnable) {
            return;
        }
        Log.i(TAG, composeDefaultMessage(TextUtils.join(",", message)));
    }

    public static void logD(String message) {
        if (!isLogEnable) {
            return;
        }
        Log.d(TAG, composeDefaultMessage(message));
    }

    public static void logE(String message) {
        if (!isLogEnable) {
            return;
        }
        Log.e(TAG, composeDefaultMessage(message));
    }

    public static void logE(Throwable exception) {
        if (!isLogEnable) {
            return;
        }
        try {
            exception.printStackTrace();
        } catch (Exception ignored) {
        }
    }

    private static String composeDefaultMessage(String message) {
        return getCurrentMethod() + " = " + message;
    }

    private static String getCurrentMethod() {
        try {
            StackTraceElement[] stacktraceObj = Thread.currentThread().getStackTrace();
            StackTraceElement stackTraceElement = stacktraceObj[5];
            String className = stackTraceElement.getClassName();
            className = className.substring(className.lastIndexOf(".") + 1, className.length());
            return " [" + className + "] " + stackTraceElement.getMethodName();
        } catch (Exception e) {
            return "";
        }
    }

    public static void logObject(Object obj) {
        logD(new Gson().toJson(obj));
    }
}
