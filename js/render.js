/**
 * render.js
 * -----------------------------------------------------------------------
 * Each renderX() function owns one region of the DOM (identified by a
 * data-slot attribute) and repaints it from `report`. Functions are
 * intentionally independent so that mutating one part of the state only
 * has to re-render the section that changed.
 * -----------------------------------------------------------------------
 */

const render = {
  root(id) {
    return document.querySelector(`[data-slot="${id}"]`);
  },

  all() {
    render.header();
    render.worker();
    render.returnToWork();
    render.recovery();
    render.painScale();
    render.medical();
    render.medication();
    render.exercises();
    render.additionalInfo();
    render.declaration();
    render.footer();
  },

  header() {
    const node = render.root("header");
    if (!node) return;
    utils.empty(node);

    node.appendChild(
      utils.el("div", { class: "report-header__brand" }, [
        utils.el("img", { src: "assets/logo1.png", alt: `${report.meta.orgName} logo`, class: "report-header__logo" }),
        utils.el("div", { class: "report-header__org" }, [
          utils.el("p", { class: "report-header__address" }, report.meta.address),
          utils.el("p", { class: "report-header__contact" }, `Phone: ${report.meta.phone}`),
          utils.el("p", { class: "report-header__contact" }, `Toll Free: ${report.meta.tollFree}`),
          utils.el("p", { class: "report-header__contact" }, report.meta.website)
        ])
      ])
    );

    node.appendChild(
      utils.el("div", { class: "report-header__title-block" }, [
        utils.el("h1", { class: "report-header__title" }, report.meta.reportTitle),
        utils.el("div", { class: "claim-chip-group" }, [
          utils.el("span", { class: "claim-chip" }, report.meta.claimNo),
          utils.el("span", { class: "claim-chip claim-chip--muted" }, report.meta.claimSuffix)
        ])
      ])
    );
  },

  worker() {
    const node = render.root("worker");
    if (!node) return;
    utils.empty(node);

    node.appendChild(
      utils.el("p", { class: "worker-banner__line" }, [
        utils.el("span", { class: "worker-banner__name" }, report.worker.name),
        " provided the following updates in relation to their claim, dated ",
        utils.el("span", { class: "worker-banner__date" }, utils.formatDate(report.worker.reportDate)),
        "."
      ])
    );
  },

  returnToWork() {
    const node = render.root("return-to-work");
    if (!node) return;
    utils.empty(node);
    const data = report.returnToWork;

    const statusGroup = components.choiceGroup({
      name: "rtw-status",
      legend: "Select one:",
      options: optionSets.returnToWorkStatus,
      getValue: () => data.status,
      onSelect: (val) => {
        data.status = val;
        render.returnToWork();
      },
      extra: {
        dateValue: () => data.returnDate,
        onDateChange: (val) => {
          data.returnDate = val;
        }
      }
    });
    node.appendChild(statusGroup);

    node.appendChild(
      components.choiceGroup({
        name: "rtw-working-as",
        legend: "I am working:",
        options: optionSets.workingAs,
        getValue: () => data.workingAs,
        onSelect: (val) => {
          data.workingAs = val;
          render.returnToWork();
        },
        extra: {
          textValue: () => data.otherDetail,
          textLabel: "Other duties detail",
          onTextChange: (val) => {
            data.otherDetail = val;
          }
        }
      })
    );

    node.appendChild(
      components.textarea({
        id: "rtw-going",
        label: "My return to work is going:",
        value: data.goingComment,
        placeholder: "Describe how the return to work is going…",
        onChange: (val) => {
          data.goingComment = val;
        }
      })
    );

    node.appendChild(
      components.dateInput({
        id: "rtw-expected",
        label: "I expect to return to work on:",
        value: data.expectedReturnDate,
        onChange: (val) => {
          data.expectedReturnDate = val;
        }
      })
    );

    node.appendChild(
      components.textarea({
        id: "rtw-concerns",
        label: "I have the following concerns about returning to work:",
        value: data.concerns,
        placeholder: "Optional",
        onChange: (val) => {
          data.concerns = val;
        }
      })
    );

    const contactRow = utils.el("div", { class: "field-row" }, [
      components.textInput({
        id: "rtw-contact-name",
        label: "I was most recently in contact with: (Name of employer contact)",
        value: data.lastContactName,
        onChange: (val) => {
          data.lastContactName = val;
        }
      }),
      components.dateInput({
        id: "rtw-contact-date",
        label: "Date",
        value: data.lastContactDate,
        onChange: (val) => {
          data.lastContactDate = val;
        }
      })
    ]);
    node.appendChild(contactRow);
  },

  recovery() {
    const node = render.root("recovery");
    if (!node) return;
    utils.empty(node);
    const data = report.recovery;

    node.appendChild(
      components.choiceGroup({
        name: "recovery-status",
        legend: "Select one:",
        options: optionSets.recoveryStatus,
        getValue: () => data.status,
        onSelect: (val) => {
          data.status = val;
          render.recovery();
        }
      })
    );

    node.appendChild(
      components.textarea({
        id: "recovery-comments",
        label: "I have provided the following comments about my recovery:",
        value: data.comments,
        placeholder: "Optional",
        onChange: (val) => {
          data.comments = val;
        }
      })
    );
  },

  painScale() {
    const node = render.root("pain-scale");
    if (!node) return;
    utils.empty(node);
    const p = report.painScale;

    node.appendChild(
      utils.el("p", { class: "field-label field-label--standalone" },
        "I rate my current pain/discomfort on a scale of 1–10, where 1 is no pain and 10 is severe pain."
      )
    );

    node.appendChild(
      components.painScale({
        min: p.min,
        max: p.max,
        getValue: () => p.value,
        onSelect: (val) => {
          p.value = val;
          render.painScale();
        }
      })
    );
  },

  medical() {
    const node = render.root("medical");
    if (!node) return;
    utils.empty(node);
    const data = report.medical;

    node.appendChild(
      components.choiceGroup({
        name: "medical-status",
        legend: "Select one:",
        options: optionSets.medicalStatus,
        getValue: () => data.status,
        onSelect: (val) => {
          data.status = val;
          render.medical();
        },
        extra: {
          textValue: () => data.providerType,
          textLabel: "Medical Provider Type",
          textPlaceholder: "Medical Provider Type",
          onTextChange: (val) => {
            data.providerType = val;
          }
        }
      })
    );

    const lastRow = utils.el("div", { class: "field-row" }, [
      components.dateInput({
        id: "medical-last-date",
        label: "My last medical treatment was from — Date",
        value: data.lastTreatment.date,
        onChange: (val) => {
          data.lastTreatment.date = val;
        }
      }),
      components.textInput({
        id: "medical-last-provider",
        label: "Medical Provider Name",
        value: data.lastTreatment.providerName,
        onChange: (val) => {
          data.lastTreatment.providerName = val;
        }
      })
    ]);
    node.appendChild(lastRow);

    const nextRow = utils.el("div", { class: "field-row" }, [
      components.dateInput({
        id: "medical-next-date",
        label: "My next medical treatment is from — Date",
        value: data.nextTreatment.date,
        onChange: (val) => {
          data.nextTreatment.date = val;
        }
      }),
      components.textInput({
        id: "medical-next-provider",
        label: "Medical Provider Name",
        value: data.nextTreatment.providerName,
        onChange: (val) => {
          data.nextTreatment.providerName = val;
        }
      })
    ]);
    node.appendChild(nextRow);

    node.appendChild(
      components.textInput({
        id: "medical-frequency",
        label: "I am attending a Chiropractor or Physiotherapist (Frequency)",
        value: data.attendingFrequency,
        placeholder: "e.g. twice weekly",
        onChange: (val) => {
          data.attendingFrequency = val;
        }
      })
    );
  },

  medication() {
    const node = render.root("medication");
    if (!node) return;
    utils.empty(node);
    const data = report.medication;

    node.appendChild(
      components.choiceGroup({
        name: "medication-status",
        legend: "Select one:",
        options: optionSets.medicationStatus,
        getValue: () => data.status,
        onSelect: (val) => {
          data.status = val;
          render.medication();
        },
        extra: {
          textValue: () => data.name,
          textLabel: "Name of prescribed medication",
          textPlaceholder: "Name of prescribed medication",
          onTextChange: (val) => {
            data.name = val;
          }
        }
      })
    );
  },

  exercises() {
    const node = render.root("exercises");
    if (!node) return;
    utils.empty(node);
    const data = report.exercises;

    node.appendChild(
      components.choiceGroup({
        name: "exercise-status",
        legend: "Select one:",
        options: optionSets.exerciseStatus,
        getValue: () => data.status,
        onSelect: (val) => {
          data.status = val;
          render.exercises();
        }
      })
    );

    node.appendChild(
      components.textarea({
        id: "exercise-list",
        label: "List the exercises you are doing:",
        value: data.list,
        placeholder: "Optional",
        onChange: (val) => {
          data.list = val;
        }
      })
    );
  },

  additionalInfo() {
    const node = render.root("additional-info");
    if (!node) return;
    utils.empty(node);
    const data = report.additionalInfo;

    node.appendChild(
      components.textarea({
        id: "additional-comments",
        label: "I would like to provide the following additional information about my claim/injury:",
        value: data.comments,
        maxLength: 2000,
        placeholder: "Optional",
        onChange: (val) => {
          data.comments = val;
        }
      })
    );
  },

  declaration() {
    const node = render.root("declaration");
    if (!node) return;
    utils.empty(node);
    const data = report.declaration;

    node.appendChild(
      utils.el("p", { class: "declaration-text" },
        "I certify that the information given on this form is true, correct and complete to the best of my knowledge. " +
        "I agree to notify the Workers Compensation Board of Manitoba (WCB) immediately once I return to any form of work and/or employment. " +
        "I understand that it is an offence to knowingly make a false statement to the WCB. I also understand that it is an offence to withhold " +
        "information from WCB which affects my entitlement to compensation (e.g., full or partial recovery from injury, ability to return to work, " +
        "sources of additional income, etc.). I understand that refusing to co-operate with, or follow my treatment, may result in the WCB reducing " +
        "or suspending my benefits."
      )
    );

    node.appendChild(
      utils.el("p", { class: "declaration-text declaration-text--muted" },
        "I understand that the Privacy Notice applies to the personal information collected in this document."
      )
    );

    node.appendChild(
      components.checkbox({
        id: "declaration-ack",
        label: "I have read and agree to the certification above.",
        checked: data.acknowledged,
        onChange: (val) => {
          data.acknowledged = val;
          render.declaration();
        }
      })
    );
  },

  footer() {
    document.querySelectorAll('[data-slot="footer"]').forEach((node) => {
      const pageNum = node.closest(".report-page")?.dataset.page || "1";
      utils.empty(node);
      node.appendChild(
        utils.el("div", { class: "page-footer__row" }, [
          utils.el("span", {}, `Worker App ID: ${report.worker.workerAppId}`),
          utils.el("span", {}, `Submitted: ${utils.formatDateTime(report.worker.submittedDate)}`),
          utils.el("span", {}, `Page ${pageNum} of ${report.meta.totalPages}`)
        ])
      );
    });
  }
};
