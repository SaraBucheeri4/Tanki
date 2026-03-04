import mindspore.nn as nn


class WaterLevelPredictor(nn.Cell):
    """
    3-layer MLP regression model.
    Input:  [temperature, ph, water_level_percent]  (3 features)
    Output: predicted next water_level_percent       (1 value)
    """

    def __init__(self):
        super().__init__()
        self.fc1 = nn.Dense(3, 64)
        self.fc2 = nn.Dense(64, 32)
        self.fc3 = nn.Dense(32, 1)
        self.relu = nn.ReLU()

    def construct(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        return self.fc3(x)
