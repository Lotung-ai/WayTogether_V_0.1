using Microsoft.AspNetCore.Mvc;
using WayTogether_V_0._1.Server.Models;
using WayTogether_V_0._1.Server.Services.Interfaces;

namespace WayTogether_V_0._1.Server.Controllers
{

    [ApiController]
    [Route("/api/[controller]")]
    public class ItineraryController : ControllerBase
    {
        private readonly IItinerary _itineraryService;
        private readonly ILogger<ItineraryController> _logger;

        public ItineraryController(IItinerary itineraryService, ILogger<ItineraryController> logger)
        {
            _itineraryService = itineraryService;
            _logger = logger;
        }

        /// <summary>
        /// Crée un nouvel itinéraire.
        /// </summary>
        /// <param name="itinerary">L'itinéraire à créer.</param>
        /// <returns>L'itinéraire créé.</returns>
        [HttpPost]
        public async Task<IActionResult> SaveItinerary([FromBody] Itinerary itinerary)
        {
            try
            {
                if (itinerary == null)
                {
                    return BadRequest("Itinerary is null.");
                }

                var result = await _itineraryService.SaveItineraryFromJsonAsync(itinerary);
                return CreatedAtAction(nameof(GetItineraryById), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la création de l'itinéraire.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Récupère tous les itinéraires.
        /// </summary>
        /// <returns>La liste des itinéraires.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllItineraries()
        {
            try
            {
                var itineraries = await _itineraryService.GetAllItinerariesAsync();
                return Ok(itineraries);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des itinéraires.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Récupère un itinéraire par son ID.
        /// </summary>
        /// <param name="id">L'ID de l'itinéraire.</param>
        /// <returns>L'itinéraire correspondant.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItineraryById(int id)
        {
            try
            {
                var itinerary = await _itineraryService.GetItineraryByIdWithStopsAsync(id);
                if (itinerary == null)
                {
                    return NotFound();
                }
                return Ok(itinerary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'itinéraire par ID.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Récupère une étape d'itinéraire par son ID.
        /// </summary>
        /// <param name="id">L'ID de l'étape d'itinéraire.</param>
        /// <returns>L'étape d'itinéraire correspondante.</returns>
        [HttpGet("stops/{id}")]
        public async Task<IActionResult> GetItineraryStopById(int id)
        {
            try
            {
                var itineraryStop = await _itineraryService.GetItineraryStopByIdAsync(id);
                if (itineraryStop == null)
                {
                    return NotFound();
                }
                return Ok(itineraryStop);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération de l'étape d'itinéraire par ID.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Récupère toutes les étapes d'un itinéraire par l'ID de l'itinéraire.
        /// </summary>
        /// <param name="itineraryId">L'ID de l'itinéraire.</param>
        /// <returns>La liste des étapes de l'itinéraire.</returns>
        [HttpGet("{itineraryId}/stops")]
        public async Task<IActionResult> GetListItineraryStopById(int itineraryId)
        {
            try
            {
                var itineraryStops = await _itineraryService.GetListItineraryStopByIdAsync(itineraryId);
                return Ok(itineraryStops);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la récupération des étapes de l'itinéraire par ID.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Met à jour un itinéraire par son ID.
        /// </summary>
        /// <param name="id">L'ID de l'itinéraire.</param>
        /// <param name="updatedItinerary">L'itinéraire mis à jour.</param>
        /// <returns>L'itinéraire mis à jour.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItinerary(int id, [FromBody] Itinerary updatedItinerary)
        {
            try
            {
                if (updatedItinerary == null || id != updatedItinerary.Id)
                {
                    return BadRequest();
                }

                var result = await _itineraryService.UpdateItineraryByIdAsync(id, updatedItinerary);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la mise à jour de l'itinéraire.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Supprime un itinéraire par son ID.
        /// </summary>
        /// <param name="id">L'ID de l'itinéraire.</param>
        /// <returns>Statut de la suppression.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItinerary(int id)
        {
            try
            {
                var result = await _itineraryService.DeleteItineraryByIdAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'itinéraire.");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Supprime une étape d'itinéraire par son ID.
        /// </summary>
        /// <param name="id">L'ID de l'étape d'itinéraire.</param>
        /// <returns>Statut de la suppression.</returns>
        [HttpDelete("stops/{id}")]
        public async Task<IActionResult> DeleteItineraryStop(int id)
        {
            try
            {
                var result = await _itineraryService.DeleteItineraryStopByIdAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de la suppression de l'étape d'itinéraire.");
                return StatusCode(500, "Internal server error");
            }
        }
    }



}
