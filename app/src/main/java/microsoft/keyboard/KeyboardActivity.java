package microsoft.keyboard;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import butterknife.BindView;
import butterknife.OnClick;

public class KeyboardActivity extends BaseActivity {

    @BindView(R.id.wv)
    WebView wv;

    public static void open(Context context, String latex) {
        LogUtils.logD(latex);
        Intent intent = new Intent(context, KeyboardActivity.class);
        intent.putExtra("extra_latext", latex);
        context.startActivity(intent);
    }

    @SuppressLint("JavascriptInterface")
    @Override
    protected void initViews(Bundle savedInstanceState) {
        wv.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                wv.loadUrl("javascript:set_latex('\\\\\\left. \\\\\\begin{cases} { 8x+2y =  46  } \\\\\\\\\\ { 7x+3y =  47  } \\\\\\end{cases} \\\\\\right.');");
            }
        });
        wv.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                LogUtils.logD(consoleMessage.message());
                return super.onConsoleMessage(consoleMessage);
            }
        });
        wv.addJavascriptInterface(this, "AndroidInterface");
        wv.getSettings().setJavaScriptEnabled(true);
        wv.loadUrl("file:///android_asset/keyboard/index.html");
    }

    @Override
    protected int onLayout() {
        return R.layout.activity_keyboard;
    }

    @OnClick(R.id.bt_show_message)
    void showMessage() {
        wv.loadUrl("javascript:get_latex_input()");
    }
}
