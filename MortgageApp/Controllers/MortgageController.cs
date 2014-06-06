using MortgageApp.Models;
using MortgageApp.Db;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.OData;

namespace MortgageApp.Controllers
{
    /// <summary>
    /// API controller for mortgages.
    /// </summary>
    public class MortgageController : ApiController
    {
        private MortgageDb _db = new MortgageDb();

        [Queryable(MaxTop=100)]
        public IQueryable<Mortgage> Get()
        {
            return _db.Mortgages;
        }

        public Mortgage GetMortgageById(int id)
        {
            Mortgage mortgage = _db.Mortgages.FirstOrDefault(x => x.Id == id);
            if (mortgage == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return mortgage;
        }

        public Mortgage PostMortgage(Mortgage mortgage)
        {
            if (ModelState.IsValid)
            {
                _db.Mortgages.Add(mortgage);
                _db.SaveChanges();
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }

            return mortgage;
        }

        [HttpPut]
        public Mortgage UpdateMortgage(int id, Mortgage mortgage)
        {
            if (!_db.Mortgages.Any(x => x.Id == id))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            if (ModelState.IsValid)
            {
                _db.Mortgages.Attach(mortgage);
                _db.Entry(mortgage).State = System.Data.EntityState.Modified;
                _db.SaveChanges();
            }
            else
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState));
            }

            return mortgage;
        }

        public void Delete(int id)
        {
            Mortgage mortgage = _db.Mortgages.FirstOrDefault(x => x.Id == id);
            if (mortgage == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);
            _db.Mortgages.Remove(mortgage);
            _db.SaveChanges();
        }

        protected override void Dispose(bool disposing)
        {
            _db.Dispose();
            base.Dispose(disposing);
        }
    }
}
