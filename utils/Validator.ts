interface ValidatorParams {
  value?: string;
  rules: string;
}

class Validator {
  value: string | null = null;
  error = "";
  rules = "";
  phone_prefix = "+225";

  constructor(params: ValidatorParams) {
    this.rules = params.rules;
    if (params.value && params.value.length) {
      this.value = params.value;
    }
  }

  validate(set_value: string | number | File | FileList | null = ""): boolean {
    this.error = "";
    let value = "";
    let isFile = false;
    if (this.value) {
      value = this.value;
    } else if (typeof set_value == "object") {

    } else if (typeof set_value == "number") {
      value = set_value.toString()
    } else {
      value = set_value.toString()

    }
    const rules = this.rules;

    if (rules.includes("file")) {
      if (set_value instanceof File || set_value instanceof FileList) {
        if (rules.includes("required")) {
          if (!set_value || (set_value instanceof File && set_value.size == 0) || (set_value instanceof FileList && set_value.length == 0)) {
            if (rules.includes('mimetype:')) {
              const allowedMimeTypes = rules
                .match(/mimetype:([^|]+)/)
                ?.[1];
              this.error = "Veillez ajouter aumoin un fichier de type" + allowedMimeTypes;

            } else {
              this.error = "Veillez ajouter aumoin un fichier";

            }
            return false;
          }
        }
        // if (rules.includes("min")) {
        //   const min = parseInt(rules.match(/min:(\d+)/)?.[1] || "0", 10);

        // }
        // if (rules.includes("max")) {
        //   const max = parseInt(rules.match(/max:(\d+)/)?.[1] || "0", 10);
        // }
        if (rules.includes("file") && isFile) {
          const allowedMimeTypes = rules
            .match(/mimetype:([^|]+)/)
            ?.[1]
            .split(",");
          if (allowedMimeTypes && !allowedMimeTypes.includes("")) {
            this.error = "Le type de fichier n'est pas autorisé.";
            return false;
          }
        }
      }
      if (rules.includes("file[]")) {
        this.error = "Ce champ doit contenir des fichiers.";
      } else {
        this.error = "Ce champ doit contenir un fichier.";
      }
      return false;
    }
    if (rules.includes("required")) {
      if (!value || value.trim().length == 0) {
        this.error = "Ce champ est obligatoire.";
        return false;
      }
    }
    if (rules.includes("min")) {
      const min = parseInt(rules.match(/min:(\d+)/)?.[1] || "0", 10);
      console.log('typeof set_value', set_value, typeof set_value);
      if (typeof set_value == "number" && rules.includes("numerique")) {
        if (set_value < min) {
          this.error = `La valeur de Ce champ ne doit pas etre inferieur à ${min}.`;
          return false;
        }
      }
      else {
        if (value.length < min) {
          this.error = `Ce champ doit avoir au moins ${min} caractères.`;
          return false;
        }
      }
    }

    if (rules.includes("max")) {
      const max = parseInt(rules.match(/max:(\d+)/)?.[1] || "0", 10);
      if (typeof set_value == "number" && rules.includes("numerique")) {
        if (set_value > max) {
          this.error = `La valeur de Ce champ ne doit pas dépasser ${max}.`;
          return false;
        }
      } else {
        if (value.length > max) {
          this.error = `Ce champ ne doit pas dépasser ${max} caractères.`;
          return false;
        }
      }

    }
    if (rules.includes("real_name")) {
      const properNameRegex = /^[A-Za-z\s]+$/;
      if (
        !properNameRegex.test(value) ||
        value.length < 3 ||
        value.length > 20
      ) {
        this.error = `Ce champ doit être un nom propre`;
        return false;
      }
    }
    if (rules.includes("alpha")) {
      const properNameRegex = /^[A-Za-z\s]+$/;
      if (!properNameRegex.test(value)) {
        this.error = `Ce champ ne doit contenir que des lètres alphabétique`;
        return false;
      }
    }
    if (rules.includes("numerique")) {
      const properNameRegex = /^[0-9]+$/;
      if (!properNameRegex.test(value)) {
        this.error = `Ce champ ne doit contenir que des chifres`;
        return false;
      }
    }

    if (rules.includes("url")) {
      const urlRegex =
        /^(http|https):\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
      if (!urlRegex.test(value)) {
        this.error = `Ce champ doit être une URL valide`;
        return false;
      }
    }
    if (rules.includes("in_list")) {
      const intListRules = rules.match(/in_list:\{([^\}]+)\}/)?.[1].split(",");
      if (!intListRules?.includes(value)) {
        this.error =
          "Ce champ doit contenir une ces valeurs : " + intListRules?.toString();
        return false;
      }
    }

    if (rules.includes("email_or_phone")) {
      const phoneRule = rules
        .match(/email_or_phone:\{([^\}]+)\}/)?.[1]
        .split(",");
      const phoneRegex = new RegExp(`^\\${phoneRule?.[0]}\\d{${phoneRule?.[1]}}$`);
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(value) && !phoneRegex.test(value)) {
        this.error =
          "Veuillez entrer un numéro de téléphone ou un mail valide.";
        return false;
      }
    } else {
      if (rules.includes("email") && !/^\S+@\S+\.\S+$/.test(value)) {
        this.error = "Veuillez entrer une adresse email valide.";
        return false;
      }

      if (rules.includes("phone")) {
        var phoneRule = rules.match(/phone:\{([^\}]+)\}/)?.[1].split(",");

        //validation format phone:{prefix,number of digits }
        const phoneRegex = new RegExp(
          `^\\${phoneRule?.[0]}\\d{${phoneRule?.[1]}}$`
        );
        if (!phoneRegex.test(value)) {
          this.error =
            "Veuillez entrer un numéro de téléphone valide avec le préfixe " +
            this.phone_prefix +
            ".";
          return false;
        }
      }
    }
    return true;
  }
}

export const fieldValidator = (params: ValidatorParams) => {
  return new Validator(params);
};
export const formValidator = (params: { [key: string]: any }) => {
  const formKeys = Object.keys(params);

  return formKeys.forEach((

  ) => {

  })
};
