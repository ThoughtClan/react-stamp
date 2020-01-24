/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 ThoughtClan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const MathHelper = {
  getAbsoluteRotation(rotation: number) {
    const val = rotation % 360;

    if (val < 0)
      return 360 + val;

    return val;
  },

  /**
   * Clamps a given number into a range, returning the lower or upper bounds if the value exceeds either of them.
   *
   * @param value The value to clamp
   * @param min Lower end of clamp range
   * @param max Upper end of clamp range
   */
  clamp(value: number, min: number, max: number) {
    if (isNaN(value) || isNaN(min) || isNaN(max))
      throw new Error('The value, min and max parameters must all be numbers');

    if (min >= max)
      throw new Error('The min value must be less than the max value');

    if (value < min)
      return min;

    if (value > max)
      return max;

    return value;
  },
};

export default MathHelper;
