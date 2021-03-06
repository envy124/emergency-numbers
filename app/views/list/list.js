var view = require("ui/core/view");
var frameModule = require("ui/frame");
var NumberListModel = require("../../models/list");
var application = require("application");
var Intent = android.content.Intent;
var Uri = android.net.Uri;
var operatorInfoModel = new NumberListModel();
var pressedNumber;

function setCallLabelClass(args, newClass) {
    var sender = args.object;
    var parent = sender.parent;
    if (parent) {
        var lbl = view.getViewById(parent, "labelCall");
        lbl.className = newClass;
    }
}

exports.loaded = function(args) {
    var page = args.object;
    var context = page.navigationContext;
    operatorInfoModel.switchTo(context.operatorName);
    page.bindingContext = operatorInfoModel;
    if (pressedNumber !== undefined) {
        pressedNumber.className = "";
        pressedNumber = undefined;
    }
};

exports.tapCall = function(e) {
    if (pressedNumber !== undefined) {
        var number = pressedNumber.text.replace(/\D/g, "");
        var dial = new Intent(Intent.ACTION_DIAL);
        dial.setData(Uri.parse("tel:" + number));
        console.log("Call to " + number);
        application.android.foregroundActivity.startActivity(dial);
        pressedNumber.className = "";
        pressedNumber = undefined;
        setCallLabelClass(e, "call-btn");
    }
};

exports.listViewItemTap = function(e) {
    if (pressedNumber !== undefined) 
        pressedNumber.className = "";
    console.log(e.view.text);
    e.view.className = "pressed";
    pressedNumber = e.view;
    setCallLabelClass(e, "call-active");
};

exports.tapBackToMain = function() {
    var topmost = frameModule.topmost();
    var viewSetup = {
        moduleName: "views/main/main-page",
        context: { resetOperator: true }
    };
    topmost.navigate(viewSetup);
};