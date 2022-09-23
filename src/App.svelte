<script>
	import {
		LeafletMap,
		TileLayer,
		Marker,
		Polyline,
		Tooltip,
		Circle,
		Icon
	} from "svelte-leafletjs";
	import hierachy from "./modules/hierachy";
	import logger from "./modules/logger";
	import locations from "./data/locations.js";
	import { tripevent } from "./modules/events";
	import Trip from "./modules/trip";
	import {
		Card,
		CardBody,
		CardTitle,
		ListGroup,
		ListGroupItem,
		Icon as BIcon,
		Styles,
		Button,
	} from "sveltestrap";
	import { STATES } from "./modules";
	const mapOptions = {
		center: [0.3576, 32.5684],
		zoom: 13,
	};
	const iconOptions = {
		iconUrl:
			"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
		shadowUrl:
			"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	};
	const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	const tileLayerOptions = {
		minZoom: 0,
		maxZoom: 50,
		maxNativeZoom: 19,
		attribution: "© OpenStreetMap contributors",
	};

	let leafletMap;
	let trip = [];
	let car = {
		status: STATES.ARRIVED,
		positions: Object.assign([], locations.data),
	};
	const BtnTexts = {
		[STATES.ARRIVED]: "TAP TO START",
		[STATES.DESTINATION]: "TAP FOR ARRIVAL",
		[STATES.TRAVELING]: "TAP TO END",
	};
	let btnText = BtnTexts[STATES.ARRIVED];

	let dest = [];
	let dest_address= "NA";

	let test_dest = [];
	let test_radius = 250;
	tripevent.addListener("tripchange", (cstate) => {
		if (cstate == STATES.TRAVELING) {
			logger.start((lat, lng) => {
				trip = Trip.addPin(trip, lat, lng);
			}, car.positions);
		} else if (cstate == STATES.DESTINATION) {
			if(Trip.empty(car.positions)){
				dest = trip[trip.length - 1];
				dest_address = "7th Street Kawaala";
			}else{
				test_dest = trip[trip.length - 1];
				dest_address="Circle Area est."
			}
			logger.stop();
		} else {
			car.positions = Object.assign([], locations.data);
			trip = [];
			dest = [];
			test_dest = [];
			dest_address="NA";
		}
	});
	tripevent.addListener("tripend", nextState);
	function nextState() {
		let cstate = hierachy.next();
		car.status = cstate;
		btnText = BtnTexts[cstate];
		tripevent.dispatch("tripchange", [cstate]);
	}
	function iconState(value, base) {
		return value == base ? "circle-fill" : "circle";
	}
</script>

<Styles />
<div class="example" style="height:100%;width:100%;">
	<LeafletMap bind:this={leafletMap} options={mapOptions}>
		<TileLayer url={tileUrl} options={tileLayerOptions} />
		<Marker latLng={[0.34935, 32.58558]} />
		{#if !Trip.empty(trip)}
			<Polyline latLngs={trip} color="red">
				<Tooltip>Resorts World Sentosa to Vivo City</Tooltip>
			</Polyline>
		{/if}
		{#if !Trip.empty(test_dest)}
        <Circle latLng={test_dest} radius={test_radius} color="#ff0000" fillColor="#ff0000" dashArray="10, 10">
        </Circle>
		{/if}
		{#if !Trip.empty(dest)}
			<Marker latLng={dest}>
				<Icon options={iconOptions}/>
			</Marker>
		{/if}
	</LeafletMap>
	<div class="lcontrol">
		<Card>
			<CardTitle>
				<h4 class="text-center mt-4 mb-0 text-blk app-title pb-0">
					Driver App
				</h4>
			</CardTitle>
			<CardBody>
				<ListGroup>
					<ListGroupItem>
						<div class="stage-text-container">
							<BIcon
								name={iconState(car.status, STATES.ARRIVED)}
								class="text-danger"
							/>
							<span class="ml-2 pb-2 stage-text">Arrival</span>
						</div>
						<div class="location-text">
							Address: 18th street, Kampala
						</div>
					</ListGroupItem>
					<ListGroupItem>
						<div class="stage-text-container">
							<BIcon
								name={iconState(car.status, STATES.TRAVELING)}
								class="text-danger"
							/>
							<span class="ml-2 pb-2 stage-text">On Trip</span>
						</div>
						<div class="location-text">Address: NA</div>
					</ListGroupItem>
					<ListGroupItem>
						<div class="stage-text-container">
							<BIcon
								name={iconState(car.status, STATES.DESTINATION)}
								class="text-danger"
							/>
							<span class="ml-2 pb-2 stage-text text-blk-1"
								>Destination</span
							>
						</div>
						<div class="location-text">Address: {dest_address}</div>
					</ListGroupItem>
				</ListGroup>
				<Button color="danger" class="w-100 mt-3" on:click={nextState}>
					<span class="tap-btn-text">{btnText}</span>
				</Button>
			</CardBody>
		</Card>
	</div>
</div>

<style>
	.lcontrol {
		position: absolute;
		z-index: 5000;
		top: 45vh;
		left: 75vw;
		width: 20em;
	}

	.text-blk {
		color: #606060;
	}

	.text-blk-1 {
		color: #1d1c1c;
	}
	.app-title {
		font-family: "Montserrat";
		font-weight: 700;
	}
	.location-text {
		text-indent: 3ch;
		font-family: "Nunito";
	}
	.stage-text-container {
		font-size: 1.05em;
	}
	.stage-text {
		display: inline-block;
		text-indent: 4px;
		font-family: "Montserrat";
		font-weight: 600;
	}
	.tap-btn-text {
		font-size: 1.05em;
		font-family: "Nunito";
	}
</style>
