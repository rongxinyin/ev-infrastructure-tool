class ChargingStation:
    def __init__(self, station_type, minimum_power=0.0, maximum_power=0.0):
        self.station_type = station_type
        self.is_available = True
        self.minimum_power = minimum_power
        self.maximum_power = maximum_power

    def release(self):
        self.is_available = True

    def __repr__(self):
        return f"power rate {self.maximum_power}W\n"
