
class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    filter() {
        // console.log(this.queryString);
        let queryObj = { ...this.queryString };
        const excludedFields = ['limit', 'sort', 'page', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        // console.log(req.query);
        //Advanced Filtering
        queryObj = JSON.stringify(queryObj);
        console.log(queryObj + ' in the advanced filtering')
        queryObj = queryObj.replace(/\b(lte|lt|gt|gte)\b/g, match => `$${match}`)
        this.query = this.query.find(JSON.parse(queryObj));
        console.log(this.queryString + ' at the end of advanced filtering');
        console.log(this.body + ' in the filter')
        return this;

    }
    sort() {
        // console.log(this.queryString.sort);
        // console.log(this.queryString);
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortBy);
        }
        console.log(this.body + ' in the sort')
        return this;

    }

    limit() {

        if (this.queryString.fields) {
            console.log(this.queryString.fields)
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v');
        }
        return this;

    }
    pagination() {

        let limit = this.queryString.limit * 1 || 10
        let page = this.queryString.page * 1 || 1
        let skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }


}

module.exports = ApiFeatures;