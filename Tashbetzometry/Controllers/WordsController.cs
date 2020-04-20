using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Tashbetzometry.Models;

namespace Tashbetzometry.Controllers
{
	public class WordsController : ApiController
	{
		public List<Words> Get()
		{
			Words w = new Words();
			return w.GetWordsFromDB();
		}

		// GET api/Word/Getdata
		[HttpGet]
		[Route("api/Words/GetData")]
		public List<Words> GetData()
		{
			Words w = new Words();
			return w.GetAllDataFromDB();
		}

		// POST api/<controller>
		public void Post([FromBody]string value)
		{
		}

		// PUT api/<controller>/5
		public void Put([FromBody]Words w)
		{
			Words countW = new Words();
			countW.PutWordsCountToDB(w);
		}

		// DELETE api/<controller>/5
		public void Delete(int id)
		{
		}
	}
}