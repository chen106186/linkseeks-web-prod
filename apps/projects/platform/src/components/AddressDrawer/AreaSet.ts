class AreaSet {

    static #instance;

    #area = new Map();

    static getInstance(): AreaSet {
        if (!this.#instance) {
            this.#instance = new AreaSet()
        }
        return this.#instance;
    }

    setArea(key: string, value: any) {
        this.#area.set(key, value);
    }

    getName(key: string, code: string) {
        const provinces = this.#area.get(key)
        console.log(key,provinces)
        for (const province of provinces) {
            if (province.value == code) {
                return province.label
            }
        }
    }

    getProvinceNameByCode(code: string) {
        return this.getName('province',code);
    }

    getCityNameByCode(code: string) {
        return this.getName('city',code);
    }

    getDistrictNameByCode(code: string) {
        return this.getName('district',code);
    }

    getStreetNameByCode(code: string) {
        return this.getName('street',code);
    }

}

export default AreaSet