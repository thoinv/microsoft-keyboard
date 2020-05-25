package microsoft.keyboard;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import org.greenrobot.eventbus.EventBus;

import butterknife.ButterKnife;

public abstract class BaseActivity extends FragmentActivity {


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        this.injectFlagOptions();
        super.onCreate(savedInstanceState);
        setContentView(onLayout());
        ButterKnife.bind(this);
        this.initViews(savedInstanceState);


        if (useEventBus() && !EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().register(this);
        }
    }

    protected int getStatusColor() {
        return R.color.white;
    }

    protected void injectFlagOptions() {
    }

    protected abstract void initViews(Bundle savedInstanceState);

    protected abstract int onLayout();

    protected boolean useEventBus() {
        return false;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (useEventBus() && EventBus.getDefault().isRegistered(this)) {
            EventBus.getDefault().unregister(this);
        }
    }
}
