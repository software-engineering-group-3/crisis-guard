package com.crisisguard.crisisguard;

import com.crisisguard.crisisguard.controller.PlaceController;
import com.crisisguard.crisisguard.controller.ReportController;
import com.crisisguard.crisisguard.models.Place;
import com.crisisguard.crisisguard.models.Report;
import com.crisisguard.crisisguard.models.Severity;
import com.crisisguard.crisisguard.repository.PlaceRepository;
import com.crisisguard.crisisguard.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class ReportControllerTests {
	@Autowired
	ObjectMapper objectMapper;

	@MockBean
	private PlaceRepository placeRepository;

	// Tests if the controller checks for existence of a Place before updating it
	@Test
	void updatePlace() throws Exception {
		var placeController = new PlaceController(placeRepository);

		Place placeOld = new Place(
				"55.7558 N, 37.6176 E",
				1,
				1,
				10000,
				"Test place"
		);

		when(placeRepository.getPlace("55.7558 N, 37.6176 E")).thenReturn(placeOld);

		placeController.updatePlace(new Place(
				"55.7558 N, 37.6176 E",
				3,
				2,
				12222,
				"Test place - updated"
		));

		verify(placeRepository).updatePlace(new Place(
				"55.7558 N, 37.6176 E",
				3,
				2,
				12222,
				"Test place - updated"
		));
}

	// Tests if the controller successfully deletes a Place
	@Test
	void deletePlace() {
		var placeController = new PlaceController(placeRepository);

		Place place = new Place(
				"55.7558 N, 37.6176 E",
				1,
				1,
				10000,
				"Test place"
		);

		when(placeRepository.getPlace("55.7558 N, 37.6176 E")).thenReturn(place);

		placeController.deletePlace("55.7558 N, 37.6176 E");

		verify(placeRepository).deletePlace("55.7558 N, 37.6176 E");
	}
}
