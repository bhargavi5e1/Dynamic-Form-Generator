document.addEventListener("DOMContentLoaded", () => {
    const editorElement = document.getElementById("json-editor");
    const errorMessage = document.getElementById("error-message");
    const generatedFormContainer = document.getElementById("generated-form");
  
    // Initialize CodeMirror for syntax highlighting
    const editor = CodeMirror.fromTextArea(editorElement, {
      mode: "application/json",
      lineNumbers: true,
      theme: "default",
    });
  
    // Sample JSON schema
    const defaultSchema = {
      title: "Dynamic Form",
      fields: [
        { label: "Name", type: "text", name: "name", required: true },
        { label: "Email", type: "email", name: "email", required: true },
        { label: "Age", type: "number", name: "age" },
        {
          label: "Gender",
          type: "select",
          name: "gender",
          options: ["Male", "Female", "Other"],
        },
        { label: "Bio", type: "textarea", name: "bio" },
      ],
    };
  
    editor.setValue(JSON.stringify(defaultSchema, null, 2));
  
    // Update form in real-time
    editor.on("change", () => {
      const jsonText = editor.getValue();
      try {
        const schema = JSON.parse(jsonText);
        errorMessage.textContent = "";
        generateForm(schema);
      } catch (error) {
        errorMessage.textContent = "Invalid JSON: " + error.message;
        generatedFormContainer.innerHTML = "";
      }
    });
  
    // Generate form based on JSON schema
    function generateForm(schema) {
      if (!schema.fields || !Array.isArray(schema.fields)) {
        generatedFormContainer.innerHTML = `<p>Invalid schema: "fields" must be an array.</p>`;
        return;
      }
  
      const form = document.createElement("form");
  
      schema.fields.forEach((field) => {
        const fieldElement = createField(field);
        if (fieldElement) form.appendChild(fieldElement);
      });
  
      // Add a submit button
      const submitButton = document.createElement("input");
      submitButton.type = "submit";
      submitButton.value = "Submit";
      form.appendChild(submitButton);
  
      generatedFormContainer.innerHTML = "";
      generatedFormContainer.appendChild(form);
    }
  
    // Create individual field elements
    function createField(field) {
      const { label, type, name, required, options } = field;
  
      if (!label || !type || !name) {
        return null;
      }
  
      const wrapper = document.createElement("div");
  
      const labelElement = document.createElement("label");
      labelElement.textContent = label;
      labelElement.htmlFor = name;
      wrapper.appendChild(labelElement);
  
      let inputElement;
      if (type === "select") {
        inputElement = document.createElement("select");
        inputElement.name = name;
        if (options && Array.isArray(options)) {
          options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            inputElement.appendChild(optionElement);
          });
        }
      } else if (type === "textarea") {
        inputElement = document.createElement("textarea");
        inputElement.name = name;
      } else {
        inputElement = document.createElement("input");
        inputElement.type = type;
        inputElement.name = name;
      }
  
      if (required) {
        inputElement.required = true;
      }
  
      wrapper.appendChild(inputElement);
      return wrapper;
    }
  
    // Initialize form
    generateForm(defaultSchema);
  });
  