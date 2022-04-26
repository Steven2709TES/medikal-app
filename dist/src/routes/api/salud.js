"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SaludServices_1 = require("./../../services/SaludServices");
const TypePeriodGlu_1 = require("./../../model/Interfaces/TypePeriodGlu");
const Utils_1 = require("../../Utils/Utils");
const router = (0, express_1.Router)();
router.post("/glucemia", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const periodo = body.periodo;
    const registro_glucemia = body.registro_glucemia;
    const email = req.headers["email"];
    var respuesta = "";
    console.log("body ", body);
    try {
        switch (periodo) {
            case TypePeriodGlu_1.TypePeriodGlu.ayunas:
                if (registro_glucemia < 70) { //-If registro_glucemia < 70 then MAL_CONTROL_HIPOGLUCEMIA
                    console.log("opcion1 ");
                    respuesta = "MAL CONTROL HIPOGLUCEMIA";
                }
                if (registro_glucemia >= 70 && registro_glucemia < 110) { //-If(registro_glucemia > =70 y registro_glucemia < 110) then BUEN_CONTROL_GLUCEMIA
                    console.log("opcion2 ");
                    respuesta = "BUEN CONTROL GLUCEMIA";
                }
                if (registro_glucemia >= 110 && registro_glucemia < 130) { //-If (registro_glucemia >= 110 y registro_glucemia < = 130) then CONTROL_ACEPTABLE
                    console.log("opcion3 ");
                    respuesta = "CONTROL ACEPTABLE";
                }
                if (registro_glucemia >= 130) { /*-If registro_glucemia > 130 MAL_CONTROL_HIPERGLUCEMIA */
                    console.log("opcion4 ");
                    respuesta = "MAL CONTROL HIPERGLUCEMIA";
                }
                break;
            case TypePeriodGlu_1.TypePeriodGlu.noAyunas:
                if (registro_glucemia < 70) { //-If registro_glucemia < 70 then MAL_CONTROL_HIPOGLUCEMIA
                    console.log("opcion1-1 ");
                    respuesta = "MAL CONTROL HIPOGLUCEMIA";
                }
                if (registro_glucemia >= 70 && registro_glucemia < 140) { //-If (registro_glucemia > =70 y registro_glucemia < 140) then BUEN_CONTROL_GLUCEMIA
                    console.log("opcion2-1 ");
                    respuesta = "BUEN CONTROL GLUCEMIA";
                }
                if (registro_glucemia >= 140 && registro_glucemia <= 180) { //If (registro_glucemia >= 140 y registro_glucemia < = 180) then CONTROL_ACEPTABLE
                    console.log("opcion3-1 ");
                    respuesta = "CONTROL ACEPTABLE";
                }
                if (registro_glucemia > 180) { /*-If registro_glucemia > 180 MAL_CONTROL_HIPERGLUCEMIA */
                    console.log("opcion4-1");
                    respuesta = "MAL CONTROL HIPERGLUCEMIA";
                }
                break;
        }
        const certificates = {
            imc: "",
            cantPreArt: "0.00",
            cantGlucemia: registro_glucemia.toString(),
            dateOfCreated: new Date()
        };
        const newRecord = yield (0, SaludServices_1.saveRecords)(email, certificates);
        const resp = {
            message: respuesta,
            data: newRecord,
            status: "success"
        };
        res.status(200).json(resp);
    }
    catch (error) {
        const respErr = {
            message: error.message,
            status: "fail"
        };
        res.status(400).json(respErr);
    }
}));
router.post("/imc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const estatura = body.height;
    const peso = body.weight;
    const email = req.headers["email"];
    var response = null;
    try {
        const IMC = (0, Utils_1.calcularIMCPaciente)(estatura, peso);
        if (IMC <= 16) {
            response = {
                status: "success",
                IMC: IMC,
                message: "NIVEL DE PESO BAJO SEVERO"
            };
            return res.status(200).json(response);
        }
        if (IMC <= 18.5 && IMC <= 18.50) {
            response = {
                status: "success",
                IMC: IMC,
                message: "NIVEL DE PESO BAJO"
            };
            return res.status(200).json(response);
        }
        if (IMC >= 18.6 && IMC <= 24.90) {
            response = {
                status: "success",
                IMC: IMC,
                message: "NIVEL DE PESO NORMAL"
            };
            return res.status(200).json(response);
        }
        if (IMC >= 25.0 && IMC <= 29.90) {
            response = {
                status: "success",
                IMC: IMC,
                message: "SOBREPESO"
            };
            return res.status(200).json(response);
        }
        if (IMC >= 30.0 && IMC <= 35.0) {
            response = {
                status: "success",
                IMC: IMC,
                message: "OBESIDAD NIVEL 1"
            };
            return res.status(200).json(response);
        }
        if (IMC >= 35.1 && IMC <= 40.0) {
            response = {
                status: "success",
                IMC: IMC,
                message: "OBESIDAD NIVEL 2"
            };
            return res.status(200).json(response);
        }
        if (IMC > 40.1) {
            response = {
                status: "success",
                IMC: IMC,
                message: "OBESIDAD NIVEL 3"
            };
            return res.status(200).json(response);
        }
    }
    catch (error) {
        const respErr = {
            message: error.message,
            status: "fail"
        };
        res.status(400).json(respErr);
    }
}));
exports.default = router;
//# sourceMappingURL=salud.js.map