// بيانات لعبة الكنز
const GAME_DATA = {
    // الفرق وأكوادها
    teams: {
        "KING1": {
            name: "فريق الملوك",
            color: "#FFD700",
            stations: [
                {
                    riddle: "ما هو الشيء الذي يكتب ولا يقرأ؟",
                    answer: "القلم",
                    location: "مكتب المدير",
                    code: "MGR01"
                },
                {
                    riddle: "شيء ليس له لسان لكنه يحكي قصة",
                    answer: "الكتاب",
                    location: "المكتبة",
                    code: "LIB02"
                },
                {
                    riddle: "لها عيون لكنها لا ترى",
                    answer: "الإبرة",
                    location: "غرفة الخياطة",
                    code: "SWS03"
                },
                {
                    riddle: "تمشي بلا أرجل وتسقط بلا جسم",
                    answer: "المطر",
                    location: "الحديقة",
                    code: "GRD04"
                },
                {
                    riddle: "تكبر كلما أكلت ولا تشعر بالجوع",
                    answer: "النار",
                    location: "المختبر",
                    code: "LAB05"
                }
            ]
        },
        "BLUE2": {
            name: "فريق الأزرق",
            color: "#4169E1",
            stations: [
                {
                    riddle: "له رأس ليس له جسد",
                    answer: "الدبوس",
                    location: "غرفة النشاط",
                    code: "ACT01"
                },
                {
                    riddle: "كلما امتلأت ازددت خفة",
                    answer: "الزجاجة",
                    location: "الكافتيريا",
                    code: "CFT02"
                },
                {
                    riddle: "يسمعك لكن لا يتكلم",
                    answer: "الهاتف",
                    location: "غرفة الاتصالات",
                    code: "COM03"
                },
                {
                    riddle: "تولد الذكور والإناث",
                    answer: "الأرض",
                    location: "الحديقة",
                    code: "GRD04"
                },
                {
                    riddle: "له عقارب لكن ليس له يدان",
                    answer: "الساعة",
                    location: "المكتب",
                    code: "OFF05"
                }
            ]
        },
        "RED3": {
            name: "فريق الأحمر",
            color: "#DC143C",
            stations: [
                {
                    riddle: "يجري بلا أرجل ويصخب بلا صوت",
                    answer: "النهر",
                    location: "المختبر",
                    code: "LAB01"
                },
                {
                    riddle: "كلما ازددت نقصت",
                    answer: "الخيوط",
                    location: "المكتبة",
                    code: "LIB02"
                },
                {
                    riddle: "هي بيت لكل شيء",
                    answer: "الصندوق",
                    location: "غرفة النشاط",
                    code: "ACT03"
                },
                {
                    riddle: "تأكل الحجر ولا تموت",
                    answer: "المحارة",
                    location: "المختبر",
                    code: "LAB04"
                },
                {
                    riddle: "لا ترى في الليل إلا إذا أضاءتها",
                    answer: "الشمعة",
                    location: "القاعة",
                    code: "HAL05"
                }
            ]
        },
        "GREEN4": {
            name: "فريق الأخضر",
            color: "#32CD32",
            stations: [
                {
                    riddle: "ما الذي يمشي في الماء ولا يبتل؟",
                    answer: "الضوء",
                    location: "المختبر",
                    code: "LAB01"
                },
                {
                    riddle: "كلما ازددت خفت",
                    answer: "الرياح",
                    location: "الحديقة",
                    code: "GRD02"
                },
                {
                    riddle: "ما الذي يسمع بلا أذن؟",
                    answer: "الجدار",
                    location: "القاعة",
                    code: "HAL03"
                },
                {
                    riddle: "ما الذي يمشي في الماء ولا يبتل؟",
                    answer: "السمك",
                    location: "المختبر",
                    code: "LAB04"
                },
                {
                    riddle: "لها أسنان لكن لا تأكل",
                    answer: "المشط",
                    location: "غرفة الخياطة",
                    code: "SWS05"
                }
            ]
        },
        "STAR5": {
            name: "فريق النجم",
            color: "#9370DB",
            stations: [
                {
                    riddle: "ما الذي يكتب بالحبر ولا يمسح؟",
                    answer: "الذاكرة",
                    location: "المكتب",
                    code: "OFF01"
                },
                {
                    riddle: "كلما كبرت صغرت",
                    answer: "البذرة",
                    location: "الحديقة",
                    code: "GRD02"
                },
                {
                    riddle: "يجري في الماء ولا يبتل",
                    answer: "الحوت",
                    location: "المختبر",
                    code: "LAB03"
                },
                {
                    riddle: "ما الذي يسمع بلا أذن؟",
                    answer: "الكتاب",
                    location: "المكتبة",
                    code: "LIB04"
                },
                {
                    riddle: "لها عقارب لكن ليس لها يدان",
                    answer: "الساعة",
                    location: "غرفة المعلمين",
                    code: "TCH05"
                }
            ]
        }
    },

    // اللغز النهائي الموحد
    finalRiddle: {
        text: "أنا حارس الكنز، أسألك ثلاثة أسئلة:\n\n1. ما عدد محطات اللعبة؟\n2. كم عدد ألوان قوس قزح؟\n3. كم عدد أضلاع المثلث؟\n\nأدخل الأرقام بالترتيب:",
        answers: ["5", "7", "3"],
        treasureLocation: "غرفة المدير - الخزنة"
    },

    // رسائل النظام
    messages: {
        wrongCode: "الكود غير صحيح! حاول مرة أخرى",
        wrongAnswer: "الإجابة خاطئة! فكر جيداً",
        correctAnswer: "إجابة صحيحة! اذهب إلى:",
        enterCode: "أدخل الكود الصحيح للمتابعة",
        finalWrong: "الإجابة خاطئة! حاول مرة أخرى",
        finalCorrect: "مبروك! وصلت إلى الكنز!"
    }
};
