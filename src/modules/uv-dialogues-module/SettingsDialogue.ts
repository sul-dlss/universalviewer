import {BaseCommands} from "../uv-shared-module/BaseCommands";
import {Dialogue} from "../uv-shared-module/Dialogue";

export class SettingsDialogue extends Dialogue {

    $locale: JQuery;
    $localeDropDown: JQuery;
    $localeLabel: JQuery;
    $scroll: JQuery;
    $title: JQuery;
    $version: JQuery;
    $website: JQuery;

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

        this.setConfig('settingsDialogue');

        super.create();

        this.openCommand = BaseCommands.SHOW_SETTINGS_DIALOGUE;
        this.closeCommand = BaseCommands.HIDE_SETTINGS_DIALOGUE;

        $.subscribe(this.openCommand, () => {
            this.open();
        });

        $.subscribe(this.closeCommand, () => {
            this.close();
        });

        this.$title = $('<h1></h1>');
        this.$content.append(this.$title);

        this.$scroll = $('<div class="scroll"></div>');
        this.$content.append(this.$scroll);

        this.$version = $('<div class="version"></div>');
        this.$content.append(this.$version);

        this.$website = $('<div class="website"></div>');
        this.$content.append(this.$website);

        this.$locale = $('<div class="setting locale"></div>');
        this.$scroll.append(this.$locale);

        this.$localeLabel = $('<label for="locale">' + this.content.locale + '</label>');
        this.$locale.append(this.$localeLabel);

        this.$localeDropDown = $('<select id="locale"></select>');
        this.$locale.append(this.$localeDropDown);

        // initialise ui.
        this.$title.text(this.content.title);       

        this.$website.html(this.content.website);
        this.$website.targetBlank();

        var locales: any[] = this.extension.getLocales();

        for (var i = 0; i < locales.length; i++) {
            var locale = locales[i];
            this.$localeDropDown.append('<option value="' + locale.name + '">' + locale.label + '</option>');
        }

        this.$localeDropDown.val(this.extension.getStore().locale);

        this.$localeDropDown.change(() => {
            this.extension.changeLocale(this.$localeDropDown.val());
        });

        if (this.extension.getLocales().length < 2){
            this.$locale.hide();
        }

        this.$element.hide();
    }

    getSettings(): ISettings {
        return this.extension.getSettings();
    }

    updateSettings(settings: ISettings): void {
        this.extension.updateSettings(settings);

        $.publish(BaseCommands.UPDATE_SETTINGS, [settings]);
    }

    open(): void {
        super.open();

        $.getJSON("package.json", (pjson: any) => {
            this.$version.text("v" + pjson.version);
        });
    }

    resize(): void {
        super.resize();
    }
}